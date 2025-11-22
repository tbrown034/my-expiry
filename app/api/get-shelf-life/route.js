import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ==================== USDA FOODKEEPER DATA ====================
// Source: USDA FoodKeeper App (https://www.foodsafety.gov/keep-food-safe/foodkeeper-app)
const USDA_FOODKEEPER_DATA = {
  // Dairy
  "milk": { refrigerator: 7, freezer: null, pantry: null, source: "USDA FoodKeeper" },
  "eggs": { refrigerator: 35, freezer: 365, pantry: null, source: "USDA FoodKeeper" },
  "butter": { refrigerator: 90, freezer: 365, pantry: null, source: "USDA FoodKeeper" },
  "yogurt": { refrigerator: 14, freezer: 60, pantry: null, source: "USDA FoodKeeper" },
  "cheese_hard": { refrigerator: 180, freezer: 180, pantry: null, source: "USDA FoodKeeper" },
  "cheese_soft": { refrigerator: 14, freezer: null, pantry: null, source: "USDA FoodKeeper" },
  "cream_cheese": { refrigerator: 14, freezer: null, pantry: null, source: "USDA FoodKeeper" },
  "sour_cream": { refrigerator: 21, freezer: null, pantry: null, source: "USDA FoodKeeper" },
  "cottage_cheese": { refrigerator: 7, freezer: null, pantry: null, source: "USDA FoodKeeper" },

  // Meat - Fresh
  "chicken_raw": { refrigerator: 2, freezer: 270, pantry: null, source: "USDA FoodKeeper" },
  "beef_raw": { refrigerator: 5, freezer: 365, pantry: null, source: "USDA FoodKeeper" },
  "ground_beef": { refrigerator: 2, freezer: 120, pantry: null, source: "USDA FoodKeeper" },
  "pork_raw": { refrigerator: 5, freezer: 180, pantry: null, source: "USDA FoodKeeper" },
  "fish_raw": { refrigerator: 2, freezer: 180, pantry: null, source: "USDA FoodKeeper" },
  "bacon": { refrigerator: 7, freezer: 30, pantry: null, source: "USDA FoodKeeper" },
  "deli_meat": { refrigerator: 5, freezer: 60, pantry: null, source: "USDA FoodKeeper" },
  "hot_dogs": { refrigerator: 14, freezer: 60, pantry: null, source: "USDA FoodKeeper" },

  // Cooked/Leftovers
  "cooked_meat": { refrigerator: 4, freezer: 90, pantry: null, source: "USDA FoodKeeper" },
  "cooked_poultry": { refrigerator: 4, freezer: 120, pantry: null, source: "USDA FoodKeeper" },
  "leftover_general": { refrigerator: 4, freezer: 90, pantry: null, source: "USDA FoodKeeper" },
  "soup_stew": { refrigerator: 4, freezer: 90, pantry: null, source: "USDA FoodKeeper" },
  "pizza_leftover": { refrigerator: 4, freezer: 60, pantry: null, source: "USDA FoodKeeper" },

  // Produce
  "apples": { refrigerator: 28, freezer: null, pantry: 7, source: "USDA FoodKeeper" },
  "bananas": { refrigerator: 5, freezer: null, pantry: 5, source: "USDA FoodKeeper" },
  "berries": { refrigerator: 5, freezer: 365, pantry: null, source: "USDA FoodKeeper" },
  "strawberries": { refrigerator: 5, freezer: 365, pantry: null, source: "USDA FoodKeeper" },
  "grapes": { refrigerator: 14, freezer: null, pantry: null, source: "USDA FoodKeeper" },
  "oranges": { refrigerator: 21, freezer: null, pantry: 7, source: "USDA FoodKeeper" },
  "lemons": { refrigerator: 28, freezer: null, pantry: 7, source: "USDA FoodKeeper" },
  "avocado": { refrigerator: 5, freezer: null, pantry: 5, source: "USDA FoodKeeper" },
  "tomatoes": { refrigerator: 7, freezer: null, pantry: 5, source: "USDA FoodKeeper" },
  "lettuce": { refrigerator: 7, freezer: null, pantry: null, source: "USDA FoodKeeper" },
  "spinach": { refrigerator: 5, freezer: null, pantry: null, source: "USDA FoodKeeper" },
  "carrots": { refrigerator: 21, freezer: 365, pantry: null, source: "USDA FoodKeeper" },
  "broccoli": { refrigerator: 5, freezer: 365, pantry: null, source: "USDA FoodKeeper" },
  "peppers": { refrigerator: 7, freezer: null, pantry: null, source: "USDA FoodKeeper" },
  "onions": { refrigerator: 60, freezer: null, pantry: 30, source: "USDA FoodKeeper" },
  "potatoes": { refrigerator: null, freezer: null, pantry: 21, source: "USDA FoodKeeper" },
  "mushrooms": { refrigerator: 7, freezer: null, pantry: null, source: "USDA FoodKeeper" },
  "celery": { refrigerator: 14, freezer: null, pantry: null, source: "USDA FoodKeeper" },
  "cucumber": { refrigerator: 7, freezer: null, pantry: null, source: "USDA FoodKeeper" },

  // Bakery
  "bread": { refrigerator: null, freezer: 90, pantry: 7, source: "USDA FoodKeeper" },
  "bagels": { refrigerator: null, freezer: 90, pantry: 5, source: "USDA FoodKeeper" },
  "tortillas": { refrigerator: 14, freezer: 180, pantry: 7, source: "USDA FoodKeeper" },

  // Prepared/Deli
  "rotisserie_chicken": { refrigerator: 4, freezer: 120, pantry: null, source: "USDA FoodKeeper" },
  "deli_salad": { refrigerator: 4, freezer: null, pantry: null, source: "USDA FoodKeeper" },
  "hummus": { refrigerator: 7, freezer: null, pantry: null, source: "USDA FoodKeeper" },
};

// ==================== FDA FOOD SAFETY DATA ====================
// Source: FDA Food Safety Guidelines
const FDA_FOOD_SAFETY_DATA = {
  "leftovers": { maxDays: 4, tip: "Use within 3-4 days or freeze", source: "FDA Food Safety" },
  "raw_poultry": { maxDays: 2, tip: "Cook or freeze within 1-2 days", source: "FDA Food Safety" },
  "raw_ground_meat": { maxDays: 2, tip: "Cook or freeze within 1-2 days", source: "FDA Food Safety" },
  "raw_beef_steaks": { maxDays: 5, tip: "Cook or freeze within 3-5 days", source: "FDA Food Safety" },
  "cooked_meat": { maxDays: 4, tip: "Refrigerate within 2 hours of cooking", source: "FDA Food Safety" },
  "deli_meats": { maxDays: 5, tip: "Use within 3-5 days after opening", source: "FDA Food Safety" },
  "eggs": { maxDays: 35, tip: "Keep refrigerated at 40°F or below", source: "FDA Food Safety" },
  "milk": { maxDays: 7, tip: "Keep refrigerated, use within a week of opening", source: "FDA Food Safety" },
};

// ==================== TOOL DEFINITIONS ====================
const tools = [
  {
    name: "lookup_usda_foodkeeper",
    description: "Look up food storage times from the official USDA FoodKeeper database. Use this for specific food items to get refrigerator, freezer, and pantry storage times.",
    input_schema: {
      type: "object",
      properties: {
        food_item: {
          type: "string",
          description: "The food item to look up (e.g., 'milk', 'chicken_raw', 'berries')"
        },
        search_terms: {
          type: "array",
          items: { type: "string" },
          description: "Alternative search terms to try (e.g., ['chicken', 'poultry', 'chicken_raw'])"
        }
      },
      required: ["food_item"]
    }
  },
  {
    name: "lookup_fda_guidance",
    description: "Look up FDA food safety guidelines for general food categories. Use this for safety rules about leftovers, raw meats, etc.",
    input_schema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "The food safety category (e.g., 'leftovers', 'raw_poultry', 'cooked_meat')"
        }
      },
      required: ["category"]
    }
  },
  {
    name: "provide_shelf_life_result",
    description: "After looking up data, provide the final shelf life result for an item. Call this once per item with the researched information.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Item name" },
        modifier: { type: "string", description: "Item modifier/descriptors" },
        shelfLifeDays: { type: "number", description: "Days until expiry (refrigerated)" },
        storageRecommendations: { type: "string", description: "Storage tips" },
        source: { type: "string", description: "Data source (USDA FoodKeeper, FDA, or AI Estimate)" },
        confidence: { type: "string", enum: ["high", "medium", "low"], description: "Confidence in the estimate" },
        isPerishable: { type: "boolean", description: "Whether item needs refrigeration" },
        foodType: { type: "string", enum: ["store-bought", "premade", "leftover"], description: "Type of food item" },
        category: { type: "string", description: "Food category" }
      },
      required: ["name", "shelfLifeDays", "storageRecommendations", "source", "confidence", "isPerishable", "foodType", "category"]
    }
  }
];

// ==================== TOOL EXECUTION ====================
function executeTool(toolName, toolInput) {
  switch (toolName) {
    case "lookup_usda_foodkeeper": {
      const searchTerms = [toolInput.food_item, ...(toolInput.search_terms || [])];
      for (const term of searchTerms) {
        const key = term.toLowerCase().replace(/\s+/g, '_');
        if (USDA_FOODKEEPER_DATA[key]) {
          return {
            found: true,
            data: USDA_FOODKEEPER_DATA[key],
            matchedTerm: key
          };
        }
      }
      // Try partial matching
      const searchKey = toolInput.food_item.toLowerCase();
      for (const [key, data] of Object.entries(USDA_FOODKEEPER_DATA)) {
        if (key.includes(searchKey) || searchKey.includes(key.replace('_', ' '))) {
          return { found: true, data, matchedTerm: key };
        }
      }
      return { found: false, message: "No USDA FoodKeeper data found for this item" };
    }

    case "lookup_fda_guidance": {
      const key = toolInput.category.toLowerCase().replace(/\s+/g, '_');
      if (FDA_FOOD_SAFETY_DATA[key]) {
        return { found: true, data: FDA_FOOD_SAFETY_DATA[key] };
      }
      return { found: false, message: "No FDA guidance found for this category" };
    }

    case "provide_shelf_life_result": {
      // This tool just passes through the data - it's used to structure the final result
      return { success: true, result: toolInput };
    }

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

// ==================== MAIN AI FUNCTION ====================
const SHELF_LIFE_SYSTEM_PROMPT = `You are a food safety expert. Your job is to determine accurate shelf life for grocery items using official sources.

## PROCESS:
1. For each item, FIRST try lookup_usda_foodkeeper with the food name and related search terms
2. If not found, try lookup_fda_guidance for the food category (leftovers, raw_poultry, etc.)
3. Only if no official data exists, provide an AI estimate with "low" confidence

## RULES:
- Leftovers and premade/deli items: MAX 4 days (FDA guideline)
- Raw poultry/ground meat: MAX 2 days
- Always use the more conservative (shorter) estimate when sources differ
- Mark source clearly: "USDA FoodKeeper", "FDA Food Safety", or "AI Estimate"

## CONFIDENCE LEVELS:
- "high": Direct match in USDA/FDA data
- "medium": Similar item found, extrapolated
- "low": AI estimate, no official source

After researching each item, call provide_shelf_life_result with the final data.`;

async function getShelfLifeWithTools(items, purchaseDate) {
  const itemsList = items.map(item =>
    `- ${item.name}${item.modifier ? ` (${item.modifier})` : ''} [${item.foodType}, ${item.category}]`
  ).join('\n');

  const messages = [
    {
      role: "user",
      content: `Get shelf life for these items (purchase date: ${purchaseDate}):\n\n${itemsList}\n\nUse the lookup tools to find official USDA/FDA data for each item, then call provide_shelf_life_result for each.`
    }
  ];

  const results = [];
  let continueLoop = true;

  while (continueLoop) {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4000,
      system: SHELF_LIFE_SYSTEM_PROMPT,
      tools,
      messages
    });

    // Check if we need to process tool calls
    if (response.stop_reason === "tool_use") {
      const assistantMessage = { role: "assistant", content: response.content };
      messages.push(assistantMessage);

      const toolResults = [];
      for (const block of response.content) {
        if (block.type === "tool_use") {
          console.log(`🔧 Tool call: ${block.name}`, block.input);
          const result = executeTool(block.name, block.input);

          // Collect shelf life results
          if (block.name === "provide_shelf_life_result" && result.success) {
            results.push(result.result);
          }

          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify(result)
          });
        }
      }

      messages.push({ role: "user", content: toolResults });
    } else {
      // End of conversation
      continueLoop = false;
    }
  }

  return results;
}

// ==================== API ROUTE ====================
function getExpiryStatus(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return "expired";
  if (daysUntilExpiry <= 3) return "expiring_soon";
  return "fresh";
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items array required' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];

    console.log(`🔬 Stage 2: Getting shelf life for ${items.length} items with tool calling...`);

    const shelfLifeResults = await getShelfLifeWithTools(items, today);

    // Process and enrich results
    const processedItems = shelfLifeResults.map(item => {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + item.shelfLifeDays);
      const expiryDateStr = expiryDate.toISOString().split('T')[0];

      return {
        ...item,
        purchaseDate: today,
        expiryDate: expiryDateStr,
        daysUntilExpiry: item.shelfLifeDays,
        status: getExpiryStatus(expiryDateStr),
        addedManually: true
      };
    });

    console.log(`✅ Got shelf life for ${processedItems.length} items`);
    console.log(`📊 Sources: ${processedItems.map(i => i.source).join(', ')}`);

    return NextResponse.json({
      stage: 2,
      items: processedItems
    });

  } catch (error) {
    console.error('❌ Error getting shelf life:', error);
    return NextResponse.json(
      { error: 'Failed to get shelf life information', details: error.message },
      { status: 500 }
    );
  }
}
