import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { ExpiryStatus } from "../../../lib/types";
import { calculateExpiryDate } from "../../../lib/utils";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
        console.log(
          "PDF files not currently supported - please convert to image first"
        );
        return NextResponse.json(
          {
            error:
              "PDF files not currently supported. Please convert to image (JPG, PNG) or text first.",
          },
          { status: 400 }
        );
      } else if (file.type.startsWith("image/")) {
        // For image files (JPEG, PNG, WebP, etc.)
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const base64 = Buffer.from(uint8Array).toString("base64");

        console.log(`Processing image file: ${file.type}...`);
        console.log("🤖 AI TRIP: Starting image analysis with Claude API");

        const message = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Extract ALL grocery items from this receipt image. Convert to simple names.

Categories: dairy, meat, vegetables, fruits, bakery, frozen, pantry, beverages, other
Ignore: bags, tax, fees, non-food

Return JSON:
{
  "groceryItems": [
    {"name": "Item name", "category": "category"}
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
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: `Extract grocery items from this CSV. Convert to simple names.

Categories: dairy, meat, vegetables, fruits, bakery, frozen, pantry, beverages, other
Ignore: non-food items

Return JSON:
{
  "groceryItems": [
    {"name": "Item name", "category": "category"}
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
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: `Extract ALL grocery items from this receipt text. Convert to simple names.

Categories: dairy, meat, vegetables, fruits, bakery, frozen, pantry, beverages, other
Ignore: bags, tax, fees, non-food

Return JSON:
{
  "groceryItems": [
    {"name": "Item name", "category": "category"}
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

        const purchaseDate = new Date().toISOString().split("T")[0];
        const expiryDate = calculateExpiryDate(
          purchaseDate,
          item.name,
          item.category
        );
        const daysUntilExpiry = Math.ceil(
          (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
        );

        const groceryItem = {
          name: item.name,
          category: item.category,
          purchaseDate,
          expiryDate,
          daysUntilExpiry,
          addedManually: false,
          status: getExpiryStatus(daysUntilExpiry),
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
