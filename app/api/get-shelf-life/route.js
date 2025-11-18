import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function getExpiryStatus(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) {
    return "expired";
  } else if (daysUntilExpiry <= 3) {
    return "expiring_soon";
  } else {
    return "fresh";
  }
}

// ==================== STRUCTURED OUTPUT SCHEMA ====================

const SHELF_LIFE_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Primary food name (capitalized)"
          },
          modifier: {
            type: "string",
            description: "Descriptors, preparation, brand, etc."
          },
          isPerishable: {
            type: "boolean",
            description: "true if needs refrigeration or has short shelf life"
          },
          foodType: {
            type: "string",
            enum: ["store-bought", "premade", "leftover"],
            description: "store-bought: packaged items. premade: deli/prepared ready-to-eat. leftover: user-cooked or opened"
          },
          category: {
            type: "string",
            enum: ["Dairy", "Meat", "Vegetables", "Fruits", "Bakery", "Frozen", "Pantry", "Beverages", "Other"],
            description: "Food category"
          },
          shelfLifeDays: {
            type: "number",
            description: "Days from purchase until food goes bad"
          },
          expiryDate: {
            type: "string",
            description: "Expiry date in YYYY-MM-DD format"
          },
          storageRecommendations: {
            type: "string",
            description: "Brief home storage tips"
          }
        },
        required: ["name", "modifier", "isPerishable", "foodType", "category", "shelfLifeDays", "expiryDate", "storageRecommendations"],
        additionalProperties: false
      }
    }
  },
  required: ["items"],
  additionalProperties: false
};

// ==================== CACHED SYSTEM PROMPT ====================

const SHELF_LIFE_SYSTEM_PROMPT = `You are a practical food safety expert helping consumers track perishable groceries.

## PARSING RULES:
Users type informal descriptions. Extract:
- PRIMARY FOOD NAME: Core item (capitalized, e.g., "Milk", "Chicken")
- MODIFIER: Descriptors, brands, preparation (e.g., "1% Fat, Costco Brand", "Pulled", "Leftover")

Examples:
- "1 percent costco brand milk" → Name: "Milk", Modifier: "1% Fat, Costco Brand"
- "leftover pizza" → Name: "Pizza", Modifier: "Leftover", foodType: "leftover"
- "deli sandwich" → Name: "Sandwich", Modifier: "Deli", foodType: "premade"
- "fresh strawberries" → Name: "Strawberries", Modifier: "Fresh", foodType: "store-bought"

## CLASSIFICATION:

### isPerishable:
- true: Fresh produce, dairy, meat, deli items, bakery, prepared foods
- false: Canned goods, dry pantry items, unopened shelf-stable

### foodType:
- "store-bought": Packaged groceries (milk, cheese, packaged meat)
- "premade": Deli/prepared ready-to-eat (deli sandwiches, rotisserie chicken, store salads)
- "leftover": User-cooked or user-opened items (keywords: "leftover", "cooked", "opened")

## SHELF LIFE:
- Leftovers: 3-4 days maximum
- Premade deli: 3-4 days maximum
- Store-bought: Standard shelf life (milk 5-7 days, meat 1-3 days, produce varies)

Be conservative with perishables - better to warn early than risk food poisoning.`;

// ==================== AI FUNCTION ====================

async function getShelfLifeFromClaude(items, purchaseDate) {
  const itemsList = Array.isArray(items) ? items : [items];

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2000,

    // Prompt caching for repeated calls
    system: [
      {
        type: "text",
        text: SHELF_LIFE_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" }
      }
    ],

    // Structured outputs for guaranteed valid JSON
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "shelf_life_analysis",
        strict: true,
        schema: SHELF_LIFE_SCHEMA
      }
    },

    messages: [
      {
        role: "user",
        content: `Analyze these grocery items and provide shelf life information.

Items: ${itemsList.join(', ')}
Purchase date: ${purchaseDate}

Focus on PERISHABLE items only. Determine if each item is store-bought, premade/deli, or leftover.`
      }
    ]
  });

  const responseText = message.content.find(block => block.type === 'text')?.text;
  if (!responseText) {
    throw new Error("No text content in AI response");
  }

  console.log(`📊 Cache usage: ${message.usage?.cache_read_input_tokens || 0} cached tokens`);

  return JSON.parse(responseText);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { itemName, itemNames } = body;

    // Support both single item and batch processing
    const isBatch = Array.isArray(itemNames);
    const items = isBatch ? itemNames : [itemName];

    if (!items || items.length === 0 || items.some(item => !item)) {
      return NextResponse.json({ error: 'Item name(s) required' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];
    const cleanItems = items.map(item => item.trim());

    console.log(`🚀 Getting shelf life for ${cleanItems.length} items with optimized AI...`);

    const claudeResponse = await getShelfLifeFromClaude(cleanItems, today);

    const processedItems = claudeResponse.items.map(item => {
      // Apply shelf life caps for premade/leftover items
      let shelfLifeDays = item.shelfLifeDays;
      if (item.foodType === 'premade' || item.foodType === 'leftover') {
        shelfLifeDays = Math.min(shelfLifeDays, 4);
      }

      const daysUntilExpiry = Math.ceil(
        (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
      );

      return {
        name: item.name,
        modifier: item.modifier || '',
        isPerishable: item.isPerishable,
        foodType: item.foodType,
        category: item.category,
        // Backwards compatibility
        isLeftover: item.foodType === 'leftover',
        shelfLifeDays,
        purchaseDate: today,
        expiryDate: item.expiryDate,
        daysUntilExpiry,
        status: getExpiryStatus(item.expiryDate),
        storageRecommendations: item.storageRecommendations,
        addedManually: true
      };
    });

    console.log(`✅ Processed ${processedItems.length} items successfully`);

    if (isBatch) {
      return NextResponse.json({ items: processedItems });
    } else {
      return NextResponse.json(processedItems[0]);
    }

  } catch (error) {
    console.error('❌ Error getting shelf life:', error);
    return NextResponse.json(
      { error: 'Failed to get shelf life information', details: error.message },
      { status: 500 }
    );
  }
}