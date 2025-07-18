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

IMPORTANT: Provide realistic "days from purchase until food goes bad" for typical home storage. This is what consumers need to know - how many days they have from when they bought it until they should use it or throw it away.

For each item, provide:
1. Category (dairy, meat, vegetables, fruits, bakery, frozen, pantry, beverages, other)
2. Realistic shelf life in DAYS FROM PURCHASE until it goes bad (assume typical home refrigerator/pantry storage)
3. Expiry date calculated from purchase date
4. Brief storage tips for home use

Examples of what we want:
- Fresh milk: 5-7 days from purchase
- Bananas: 4-5 days from purchase  
- Ground beef: 1-2 days from purchase
- Bread: 3-5 days from purchase
- Canned goods: 365+ days from purchase

Return JSON:
{
  "items": [
    {
      "name": "item name",
      "category": "category", 
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
        category: item.category,
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