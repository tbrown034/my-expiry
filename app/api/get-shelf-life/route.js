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

async function getShelfLifeFromClaude(items, purchaseDate) {
  const itemsList = Array.isArray(items) ? items : [items];
  
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You are a practical food safety expert helping consumers understand how long their groceries will last at home.

Food items: ${itemsList.join(', ')}
Purchase date: ${purchaseDate}

IMPORTANT PARSING INSTRUCTIONS:
- Users can type anything (e.g., "1 percent costco brand milk", "pulled chicken", "dark meat chicken thighs")
- Always identify the PRIMARY FOOD ITEM as the main "name" (e.g., "Milk", "Chicken", "Bread")
- Extract any MODIFIERS separately (e.g., "1% Fat, Costco Brand", "Pulled", "Dark Meat, Thighs")
- Format the name as the core food item in title case
- Put descriptive details, preparation methods, brands, or specifications in the modifier field

Examples of proper parsing:
- User input: "1 percent costco brand milk" → Name: "Milk", Modifier: "1% Fat, Costco Brand"
- User input: "pulled chicken" → Name: "Chicken", Modifier: "Pulled"
- User input: "dark meat chicken thighs" → Name: "Chicken", Modifier: "Dark Meat, Thighs"
- User input: "leftover pizza" → Name: "Pizza", Modifier: "Leftover"
- User input: "organic bananas" → Name: "Bananas", Modifier: "Organic"
- User input: "frozen ground beef" → Name: "Ground Beef", Modifier: "Frozen"

IMPORTANT: Provide realistic "days from purchase until food goes bad" for typical home storage. This is what consumers need to know - how many days they have from when they bought it until they should use it or throw it away.

SPECIAL ATTENTION TO LEFTOVERS: When items are identified as leftovers, provide shorter shelf life appropriate for cooked food storage. Leftovers should typically last 3-4 days in the refrigerator.

For each item, provide:
1. Primary food name (clean, formal name with proper capitalization)
2. Modifiers (descriptors, preparation, brand, etc.) - can be empty string if none
3. Category - MUST be one of these exact values: "Dairy", "Meat", "Vegetables", "Fruits", "Bakery", "Frozen", "Pantry", "Beverages", "Other"
4. Did the user indicate this is a leftover? (true/false) - check for words like "leftover", "cooked", "prepared", etc.
5. Realistic shelf life in DAYS FROM PURCHASE until it goes bad (assume typical home refrigerator/pantry storage)
6. Expiry date calculated from purchase date
7. Brief storage tips for home use

Return JSON:
{
  "items": [
    {
      "name": "Primary Food Name (Capitalized)",
      "modifier": "descriptors/preparation/brand if any",
      "category": "Category (Capitalized)",
      "isLeftover": boolean, 
      "shelfLifeDays": number,
      "expiryDate": "YYYY-MM-DD",
      "storageRecommendations": "brief home storage tips"
    }
  ]
}

Base on FDA/USDA guidelines but focus on practical consumer timeframes for home use.`
      }
    ]
  });

  const content = message.content[0].text;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid AI response format");
  }

  return JSON.parse(jsonMatch[0]);
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

    console.log(`Getting shelf life for ${cleanItems.length} items using Claude AI...`);
    
    const claudeResponse = await getShelfLifeFromClaude(cleanItems, today);
    
    const processedItems = claudeResponse.items.map(item => {
      const daysUntilExpiry = Math.ceil(
        (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
      );

      return {
        name: item.name,
        modifier: item.modifier || '',
        category: item.category,
        isLeftover: item.isLeftover || false,
        shelfLifeDays: item.shelfLifeDays,
        purchaseDate: today,
        expiryDate: item.expiryDate,
        daysUntilExpiry,
        status: getExpiryStatus(item.expiryDate),
        storageRecommendations: item.storageRecommendations,
        addedManually: true
      };
    });

    if (isBatch) {
      return NextResponse.json({ items: processedItems });
    } else {
      return NextResponse.json(processedItems[0]);
    }

  } catch (error) {
    console.error('Error getting shelf life:', error);
    return NextResponse.json(
      { error: 'Failed to get shelf life information', details: error.message },
      { status: 500 }
    );
  }
}