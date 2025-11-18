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

// ==================== SMART PRE-PROCESSING ====================

/**
 * Detects if content looks like Kroger or similar web copy-paste
 */
function looksLikeWebCopyPaste(content) {
  const webIndicators = [
    /Skip to content/i,
    /©\d{4}/,
    /Privacy Policy/i,
    /Terms and Conditions/i,
    /Follow us on/i,
    /Facebook site logo/i,
    /All Rights Reserved/i,
    /Digital Coupons/i,
    /Weekly Ad/i,
    /Store Locator/i,
  ];

  let matches = 0;
  for (const pattern of webIndicators) {
    if (pattern.test(content)) {
      matches++;
    }
  }

  // If 3+ web indicators found, it's probably a web copy-paste
  return matches >= 3;
}

/**
 * Cleans Kroger and similar grocery website copy-paste content
 */
function cleanWebReceiptContent(content) {
  console.log("🧹 Cleaning web receipt copy-paste content...");

  let cleaned = content;

  // Remove common header/navigation sections
  cleaned = cleaned.replace(/^.*?(?=Purchase Details|In-store|Order Details|Items)/is, '');

  // Remove footer content (everything after payment summary or last item)
  cleaned = cleaned.replace(/(?:ABOUT US|GET THE APP|Let's Connect|All Contents ©)[\s\S]*$/i, '');

  // Remove navigation links and buttons
  cleaned = cleaned.replace(/Skip to content[\s\S]*?(?=Purchase|In-store)/i, '');
  cleaned = cleaned.replace(/Digital Coupons|Weekly Ad|Meal Planning|Store Locator|Breadcrumb/gi, '');
  cleaned = cleaned.replace(/Home(?:Purchase History)?Purchase Details/i, 'Purchase Details');

  // Remove social media and legal links
  cleaned = cleaned.replace(/(?:X|Facebook|YouTube|Pinterest|Instagram) site logo/gi, '');
  cleaned = cleaned.replace(/Privacy Policy|Terms and Conditions|HIPAA Notice/gi, '');
  cleaned = cleaned.replace(/Financial Products.*?Privacy Policy/is, '');

  // Remove survey/marketing content
  cleaned = cleaned.replace(/Review your experience.*?Take Survey.*?(?:\n|$)/gi, '');
  cleaned = cleaned.replace(/\(Opens in a new tab or window\)/gi, '');

  // Remove redundant whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();

  console.log(`✅ Cleaned content: ${content.length} → ${cleaned.length} characters`);

  return cleaned;
}

// ==================== JSON SCHEMA FOR STRUCTURED OUTPUTS ====================

const RECEIPT_ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      description: "List of grocery items found in the receipt",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Simple, generic food name (e.g., 'milk' not 'Kroger 2% Milk')"
          },
          originalName: {
            type: "string",
            description: "Original product name from receipt"
          },
          isPerishable: {
            type: "boolean",
            description: "true if needs refrigeration or has short shelf life. Beer, soda, canned goods = false. Fresh produce, dairy, meat, prepared foods = true. Fruit juice = true, beer = false."
          },
          foodType: {
            type: "string",
            enum: ["store-bought", "premade", "skip"],
            description: "store-bought: packaged raw/processed foods. premade: deli/prepared ready-to-eat items (sandwiches, salads, rotisserie chicken). skip: non-food or non-perishable beverages (beer, soda, supplements, household items)"
          },
          category: {
            type: "string",
            enum: ["dairy", "meat", "vegetables", "fruits", "bakery", "frozen", "pantry", "beverages", "other"],
            description: "Food category"
          },
          shelfLifeDays: {
            type: "number",
            description: "Days from purchase until food goes bad. Premade items: max 3-4 days. Store-bought: typical shelf life."
          },
          quantity: {
            type: "number",
            description: "Number of items purchased (default 1)"
          },
          price: {
            type: ["number", "null"],
            description: "Price paid in dollars, or null if not found"
          },
          storageRecommendations: {
            type: "string",
            description: "Brief home storage tips"
          }
        },
        required: ["name", "isPerishable", "foodType", "category", "shelfLifeDays", "quantity"],
        additionalProperties: false
      }
    },
    receiptDate: {
      type: ["string", "null"],
      description: "Receipt date in YYYY-MM-DD format, or null if not found"
    },
    totalItems: {
      type: "number",
      description: "Total number of items analyzed (before filtering)"
    },
    skippedItems: {
      type: "array",
      description: "Names of non-food or non-perishable items that were skipped",
      items: { type: "string" }
    },
    summary: {
      type: "string",
      description: "Brief summary of what was found"
    }
  },
  required: ["items", "receiptDate", "totalItems", "skippedItems", "summary"],
  additionalProperties: false
};

// ==================== CACHED SYSTEM PROMPT ====================

const PERISHABLE_EXPERT_SYSTEM_PROMPT = `You are a food safety and grocery tracking expert helping users manage perishable foods.

Your job is to analyze receipts and extract ONLY perishable food items that need tracking.

## KEY RULES:

### What IS Perishable (track these):
- Fresh produce (fruits, vegetables)
- Dairy products (milk, cheese, yogurt)
- Fresh meat, poultry, seafood
- Deli/prepared foods (sandwiches, salads, rotisserie chicken)
- Bakery items (bread, pastries)
- Fresh juices and smoothies
- Opened or prepared foods

### What is NOT Perishable (skip these):
- Beer, wine, spirits (alcoholic beverages)
- Soda, energy drinks, sports drinks
- Canned goods (unless opened)
- Dry pantry items (pasta, rice, cereal - unless opened)
- Supplements, vitamins, medications
- Household items, personal care
- Frozen items (track only if user indicates they'll thaw soon)

### Food Type Classification:

**"store-bought"**: Packaged items from grocery shelves
- Packaged milk, cheese, yogurt
- Pre-packaged deli meats and cheeses
- Frozen pizzas (if tracking)
- Store-brand packaged items
- Shelf life: Use typical package dates

**"premade"**: Store-prepared ready-to-eat items
- Deli sandwiches, wraps, salads
- Rotisserie chicken
- Fresh sushi
- Store-made meals from hot bar or deli counter
- Shelf life: Maximum 3-4 days regardless of package

**"skip"**: Do not track
- All non-food items
- Non-perishable beverages (beer, soda)
- Supplements and medications
- Shelf-stable pantry items

### Shelf Life Guidelines:
- Premade deli items: 3-4 days maximum
- Fresh milk: 5-7 days
- Fresh produce: varies (berries 3-5 days, apples 7-10 days)
- Fresh meat: 1-3 days (beef 3 days, ground meat 1-2 days, chicken 1-2 days)
- Deli cheese/meat (packaged): 5-7 days unopened
- Bread: 3-5 days

### Important:
- Convert brand names to generic food names (Kroger Milk → milk)
- If uncertain whether something is perishable, err on the side of tracking it
- Extract quantities when mentioned (e.g., "2 lbs" = quantity: 2)
- Extract prices when visible
- Look for purchase/receipt dates

Be thorough but conservative - only track what truly needs monitoring.`;

// ==================== HELPER FUNCTIONS ====================

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

/**
 * Formats content for AI analysis based on file type
 */
function formatReceiptPrompt(content, fileType) {
  if (fileType?.startsWith('image/')) {
    return `Analyze this receipt image and extract all perishable grocery items.

Extract:
- Item names (convert to simple generic names)
- Quantities purchased
- Prices if visible
- Receipt date if visible

Focus on perishable items only. Skip beer, soda, supplements, and household items.`;
  }

  return `Analyze this receipt and extract all perishable grocery items.

Receipt content:
${content}

Extract:
- Item names (convert to simple generic names)
- Quantities purchased
- Prices if visible
- Receipt date if visible

Focus on perishable items only. Skip beer, soda, supplements, and household items.`;
}

/**
 * Extracts content from uploaded file
 */
async function extractFileContent(file) {
  if (file.type === "application/pdf") {
    console.log("📄 Processing PDF file...");
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!pdf) {
      const pdfParseModule = await import('pdf-parse');
      pdf = pdfParseModule.default || pdfParseModule;
    }

    const pdfData = await pdf(buffer);
    const pdfText = pdfData.text;

    if (!pdfText.trim()) {
      throw new Error("PDF appears to contain no readable text");
    }

    console.log(`✅ Extracted ${pdfText.length} characters from PDF`);
    return { content: pdfText, type: 'text' };

  } else if (file.type.startsWith("image/")) {
    console.log("🖼️ Processing image file...");
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64 = Buffer.from(uint8Array).toString("base64");

    return {
      content: base64,
      type: 'image',
      mediaType: file.type
    };

  } else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
    console.log("📊 Processing CSV file...");
    const csvText = await file.text();
    return { content: csvText, type: 'text' };

  } else {
    console.log("📝 Processing text file...");
    const textContent = await file.text();

    if (!textContent.trim()) {
      throw new Error("File appears to be empty");
    }

    return { content: textContent, type: 'text' };
  }
}

// ==================== MAIN API ROUTE ====================

export async function POST(request) {
  try {
    console.log("🚀 Starting optimized receipt analysis...");

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is missing");
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

    console.log(`📄 File: ${file.name} (${file.size} bytes, ${file.type})`);

    // ==================== STEP 1: EXTRACT CONTENT ====================
    let extractedData;
    try {
      extractedData = await extractFileContent(file);
    } catch (extractError) {
      console.error("❌ File extraction error:", extractError);
      return NextResponse.json(
        {
          error: "Failed to extract content from file",
          details: extractError.message,
        },
        { status: 400 }
      );
    }

    // ==================== STEP 2: SMART PRE-PROCESSING ====================
    let content = extractedData.content;

    if (extractedData.type === 'text' && looksLikeWebCopyPaste(content)) {
      console.log("🔍 Detected web copy-paste (Kroger-style)");
      content = cleanWebReceiptContent(content);
    }

    // ==================== STEP 3: AI ANALYSIS WITH ADVANCED FEATURES ====================
    console.log("🤖 AI TRIP: Starting Claude API analysis with structured outputs + caching + extended thinking");

    let messageConfig = {
      model: "claude-sonnet-4-5-20250929", // Latest model
      max_tokens: 4000,

      // PROMPT CACHING - saves ~90% on repeated calls
      system: [
        {
          type: "text",
          text: PERISHABLE_EXPERT_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" }
        }
      ],

      // EXTENDED THINKING - better accuracy for ambiguous items
      thinking: {
        type: "enabled",
        budget_tokens: 5000
      },

      // STRUCTURED OUTPUTS - guaranteed valid JSON
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "receipt_analysis",
          strict: true,
          schema: RECEIPT_ANALYSIS_SCHEMA
        }
      },

      messages: []
    };

    // Build message content based on file type
    if (extractedData.type === 'image') {
      messageConfig.messages = [{
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: extractedData.mediaType,
              data: content
            }
          },
          {
            type: "text",
            text: formatReceiptPrompt(content, file.type)
          }
        ]
      }];
    } else {
      messageConfig.messages = [{
        role: "user",
        content: formatReceiptPrompt(content, file.type)
      }];
    }

    let message;
    try {
      message = await anthropic.messages.create(messageConfig);
      console.log("✅ AI TRIP: Completed analysis");
      console.log(`💭 Thinking tokens used: ${message.usage?.thinking_tokens || 0}`);
      console.log(`📊 Cache usage: ${message.usage?.cache_read_input_tokens || 0} cached tokens read`);
    } catch (aiError) {
      console.error("❌ AI API error:", aiError);
      return NextResponse.json(
        {
          error: "Failed to process receipt with AI",
          details: aiError.message,
        },
        { status: 500 }
      );
    }

    // ==================== STEP 4: PARSE STRUCTURED OUTPUT ====================
    let analysisResult;
    try {
      // With structured outputs, we get guaranteed valid JSON
      const responseText = message.content.find(block => block.type === 'text')?.text;

      if (!responseText) {
        throw new Error("No text content in AI response");
      }

      analysisResult = JSON.parse(responseText);
      console.log(`📦 Parsed result: ${analysisResult.totalItems} total items, ${analysisResult.items.length} perishable items`);
    } catch (parseError) {
      console.error("❌ Failed to parse AI response:", parseError);
      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          details: parseError.message,
        },
        { status: 500 }
      );
    }

    // ==================== STEP 5: FILTER & PROCESS PERISHABLE ITEMS ====================
    console.log("🔍 Filtering to perishable items only...");

    const perishableItems = analysisResult.items.filter(
      item => item.isPerishable && item.foodType !== "skip"
    );

    console.log(`✅ Found ${perishableItems.length} perishable items (skipped ${analysisResult.skippedItems?.length || 0} non-perishables)`);

    // Process items for frontend
    const processedItems = perishableItems.map(item => {
      const purchaseDate = analysisResult.receiptDate || new Date().toISOString().split("T")[0];

      // Apply shelf life rules
      let shelfLifeDays = item.shelfLifeDays;

      // Cap premade items at 4 days max
      if (item.foodType === "premade") {
        shelfLifeDays = Math.min(shelfLifeDays, 4);
      }

      // Calculate expiry date
      const expiryDate = new Date(purchaseDate);
      expiryDate.setDate(expiryDate.getDate() + shelfLifeDays);
      const expiryDateString = expiryDate.toISOString().split("T")[0];

      const daysUntilExpiry = Math.ceil(
        (new Date(expiryDateString) - new Date()) / (1000 * 60 * 60 * 24)
      );

      return {
        name: item.name,
        originalName: item.originalName || item.name,
        category: item.category,
        foodType: item.foodType,
        purchaseDate,
        expiryDate: expiryDateString,
        shelfLifeDays,
        daysUntilExpiry,
        quantity: item.quantity || 1,
        price: item.price || null,
        addedManually: false,
        status: getExpiryStatus(expiryDateString),
        storageRecommendations: item.storageRecommendations || null,
      };
    });

    // ==================== STEP 6: RETURN RESULTS ====================
    console.log(`✅ Successfully processed receipt: ${processedItems.length} perishable items ready`);

    return NextResponse.json({
      analysis: analysisResult.summary,
      groceryItems: processedItems,
      itemsFound: processedItems.length,
      receiptDate: analysisResult.receiptDate,
      summary: analysisResult.summary,
      skippedItems: analysisResult.skippedItems || [],
      totalItemsAnalyzed: analysisResult.totalItems,
      optimizations: {
        promptCaching: true,
        extendedThinking: true,
        structuredOutputs: true,
        smartPreProcessing: extractedData.type === 'text' && looksLikeWebCopyPaste(extractedData.content)
      }
    });

  } catch (error) {
    console.error("❌ Unexpected error analyzing receipt:", error);
    console.error("Stack:", error.stack);
    return NextResponse.json(
      {
        error: "Failed to analyze receipt",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
