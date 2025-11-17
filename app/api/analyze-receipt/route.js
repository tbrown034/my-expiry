import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { ExpiryStatus } from "../../../lib/types";
// Dynamic import to avoid build issues
let pdf;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY environment variable is not set");
}

function getExpiryStatus(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) {
    return ExpiryStatus.EXPIRED;
  } else if (daysUntilExpiry <= 3) {
    return ExpiryStatus.EXPIRING_SOON;
  } else {
    return ExpiryStatus.FRESH;
  }
}

export async function POST(request) {
  try {
    console.log("Starting receipt analysis...");
    
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is missing in production");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      console.error("No file provided in request");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log(
      `Processing file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`
    );

    // Handle different file types
    let content;
    try {
      if (file.type === "application/pdf") {
        // For PDF files - extract text and analyze
        console.log("Processing PDF file...");
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        try {
          if (!pdf) {
            try {
              const pdfParseModule = await import('pdf-parse');
              pdf = pdfParseModule.default || pdfParseModule;
            } catch (importError) {
              console.error("Failed to import pdf-parse:", importError);
              throw new Error("PDF processing library unavailable. Please try uploading as an image instead.");
            }
          }
          const pdfData = await pdf(buffer);
          const pdfText = pdfData.text;
          
          if (!pdfText.trim()) {
            console.error("PDF appears to contain no readable text");
            return NextResponse.json(
              {
                error: "PDF appears to contain no readable text. Please ensure it's a text-based PDF.",
              },
              { status: 400 }
            );
          }

          console.log(`Extracted ${pdfText.length} characters from PDF`);
          console.log("🤖 AI TRIP: Starting PDF analysis with Claude API");

          const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 4000,
            messages: [
              {
                role: "user",
                content: `Extract ALL grocery/food items from this Kroger receipt PDF text. Convert product names to simple, common food names and provide realistic home shelf life information.

Categories: dairy, meat, vegetables, fruits, bakery, frozen, pantry, beverages, other
Ignore: non-food items (personal care, household, bags, tax, fees, store info, payment info)

Important: 
- Convert brand names to generic food names (e.g., "Cheez-It Crackers" → "crackers")
- Focus only on food and beverages
- Use simple, common names people would search for
- Be thorough - this receipt has many items
- Provide realistic "days from purchase until food goes bad" for typical home storage
- This is what consumers need: how many days from when they bought it until they should use it

Examples of realistic shelf life:
- Fresh milk: 5-7 days from purchase
- Bananas: 4-5 days from purchase
- Ground beef: 1-2 days from purchase
- Bread: 3-5 days from purchase

Return JSON:
{
  "groceryItems": [
    {
      "name": "simple food name", 
      "category": "category",
      "shelfLifeDays": number,
      "storageRecommendations": "brief home storage tips"
    }
  ],
  "receiptDate": "YYYY-MM-DD or null",
  "summary": "Found X grocery items from receipt"
}

PDF Receipt text:
${pdfText}`,
              },
            ],
          });

          console.log("✅ AI TRIP: Completed PDF analysis with Claude API");
          console.log(`📊 AI RESPONSE: Received ${message.content[0].text.length} characters`);
          content = message.content[0].text;
        } catch (pdfError) {
          console.error("Error processing PDF:", pdfError);
          return NextResponse.json(
            {
              error: "Failed to extract text from PDF. Please ensure it's a valid PDF file.",
              details: pdfError.message,
            },
            { status: 400 }
          );
        }
      } else if (file.type.startsWith("image/")) {
        // For image files (JPEG, PNG, WebP, etc.)
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const base64 = Buffer.from(uint8Array).toString("base64");

        console.log(`Processing image file: ${file.type}...`);
        console.log("🤖 AI TRIP: Starting image analysis with Claude API");

        const message = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Extract ALL grocery items from this receipt image. Convert to simple names and provide realistic home shelf life information.

Categories: dairy, meat, vegetables, fruits, bakery, frozen, pantry, beverages, other
Ignore: bags, tax, fees, non-food

Important:
- Provide realistic "days from purchase until food goes bad" for typical home storage
- This is what consumers need: how many days from when they bought it until they should use it

Examples: milk 5-7 days, bananas 4-5 days, ground beef 1-2 days, bread 3-5 days

Return JSON:
{
  "groceryItems": [
    {
      "name": "Item name", 
      "category": "category",
      "shelfLifeDays": number,
      "storageRecommendations": "brief home storage tips"
    }
  ],
  "receiptDate": "YYYY-MM-DD or null",
  "summary": "Found X items"
}`,
                },
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: file.type,
                    data: base64,
                  },
                },
              ],
            },
          ],
        });

        console.log("✅ AI TRIP: Completed image analysis with Claude API");
        console.log(`📊 AI RESPONSE: Received ${message.content[0].text.length} characters`);
        content = message.content[0].text;
      } else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        // For CSV files
        const csvText = await file.text();

        console.log("Processing CSV file...");
        console.log("🤖 AI TRIP: Starting CSV analysis with Claude API");

        const message = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: `Extract grocery items from this CSV. Convert to simple names and provide realistic home shelf life information.

Categories: dairy, meat, vegetables, fruits, bakery, frozen, pantry, beverages, other
Ignore: non-food items

Important:
- Provide realistic "days from purchase until food goes bad" for typical home storage
- This is what consumers need: how many days from when they bought it until they should use it

Examples: milk 5-7 days, bananas 4-5 days, ground beef 1-2 days, bread 3-5 days

Return JSON:
{
  "groceryItems": [
    {
      "name": "Item name", 
      "category": "category",
      "shelfLifeDays": number,
      "storageRecommendations": "brief home storage tips"
    }
  ],
  "receiptDate": null,
  "summary": "Found X items"
}

CSV Data:
${csvText}`,
            },
          ],
        });

        console.log("✅ AI TRIP: Completed CSV analysis with Claude API");
        console.log(`📊 AI RESPONSE: Received ${message.content[0].text.length} characters`);
        content = message.content[0].text;
      } else {
        // For text files
        content = await file.text();

        if (!content.trim()) {
          console.error(
            "File appears to be empty or contains no readable text"
          );
          return NextResponse.json(
            {
              error: "File appears to be empty or contains no readable text",
            },
            { status: 400 }
          );
        }

        console.log("Processing text file...");
        console.log("🤖 AI TRIP: Starting text analysis with Claude API");

        const message = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: `Extract ALL grocery items from this receipt text. Convert to simple names and provide realistic home shelf life information.

Categories: dairy, meat, vegetables, fruits, bakery, frozen, pantry, beverages, other
Ignore: bags, tax, fees, non-food

Important:
- Provide realistic "days from purchase until food goes bad" for typical home storage
- This is what consumers need: how many days from when they bought it until they should use it

Examples: milk 5-7 days, bananas 4-5 days, ground beef 1-2 days, bread 3-5 days

Return JSON:
{
  "groceryItems": [
    {
      "name": "Item name", 
      "category": "category",
      "shelfLifeDays": number,
      "storageRecommendations": "brief home storage tips"
    }
  ],
  "receiptDate": "YYYY-MM-DD or null",
  "summary": "Found X items"
}

Receipt text:
${content}`,
            },
          ],
        });

        console.log("✅ AI TRIP: Completed text analysis with Claude API");
        console.log(`📊 AI RESPONSE: Received ${message.content[0].text.length} characters`);
        content = message.content[0].text;
      }

      console.log("Successfully received AI response");
    } catch (aiError) {
      console.error("AI processing error:", aiError);
      return NextResponse.json(
        {
          error: "Failed to process receipt with AI",
          details: aiError.message,
        },
        { status: 500 }
      );
    }

    // Parse the AI response
    let analysisResult;
    try {
      console.log("Parsing AI response...");
      console.log("Raw response:", content);

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("No JSON found in response:", content);
        return NextResponse.json(
          {
            error: "Invalid AI response format",
            rawResponse: content,
          },
          { status: 500 }
        );
      }

      analysisResult = JSON.parse(jsonMatch[0]);
      console.log("Parsed analysis result:", analysisResult);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Response content:", content);
      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          details: parseError.message,
          rawResponse: content,
        },
        { status: 500 }
      );
    }

    if (
      !analysisResult.groceryItems ||
      !Array.isArray(analysisResult.groceryItems)
    ) {
      console.warn("No grocery items found in analysis result");
      return NextResponse.json({
        analysis: analysisResult.summary || "No items found",
        groceryItems: [],
        itemsFound: 0,
        receiptDate: analysisResult.receiptDate || null,
        summary: analysisResult.summary || "No items found",
      });
    }

    console.log(
      `Processing ${analysisResult.groceryItems.length} grocery items...`
    );
    const processedItems = [];

    for (const [index, item] of analysisResult.groceryItems.entries()) {
      try {
        if (!item.name || !item.category) {
          console.warn(`Skipping incomplete item at index ${index}:`, item);
          continue;
        }

        const purchaseDate = analysisResult.receiptDate || new Date().toISOString().split("T")[0];
        
        // Calculate expiry date from shelf life
        const expiryDate = new Date(purchaseDate);
        expiryDate.setDate(expiryDate.getDate() + (item.shelfLifeDays || 7)); // default 7 days if no shelf life
        const expiryDateString = expiryDate.toISOString().split("T")[0];
        
        const daysUntilExpiry = Math.ceil(
          (new Date(expiryDateString) - new Date()) / (1000 * 60 * 60 * 24)
        );

        const groceryItem = {
          name: item.name,
          category: item.category,
          purchaseDate,
          expiryDate: expiryDateString,
          shelfLifeDays: item.shelfLifeDays || 7,
          daysUntilExpiry,
          addedManually: false,
          status: getExpiryStatus(expiryDateString),
          storageRecommendations: item.storageRecommendations || null,
        };

        processedItems.push(groceryItem);
        console.log(`Successfully processed item: ${item.name}`);
      } catch (itemError) {
        console.error(
          `Failed to process item at index ${index}:`,
          itemError,
          item
        );
      }
    }

    console.log(
      `Successfully processed receipt. Found ${processedItems.length} items.`
    );
    return NextResponse.json({
      analysis: analysisResult.summary,
      groceryItems: processedItems,
      itemsFound: processedItems.length,
      receiptDate: analysisResult.receiptDate,
      summary: analysisResult.summary,
    });
  } catch (error) {
    console.error("Unexpected error analyzing receipt:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        error: "Failed to analyze receipt",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
