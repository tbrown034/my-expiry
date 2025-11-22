import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Stage 1: Parse and interpret user input (typed items or receipt text)
// This does NOT estimate shelf life - just cleans up and structures the input

const PARSE_SYSTEM_PROMPT = `You are a grocery list parser. Your job is to interpret informal user input and extract structured grocery items.

## YOUR TASK:
Parse the user's grocery list and extract each item with:
- name: The primary food item (capitalized, e.g., "Milk", "Chicken Breast")
- modifier: Any descriptors like brand, size, preparation (e.g., "Organic, 1 gallon", "Boneless skinless")
- quantity: Number of items (default 1 if not specified)
- category: Best guess category (Dairy, Meat, Vegetables, Fruits, Bakery, Frozen, Pantry, Beverages, Other)
- foodType: "store-bought" (packaged), "premade" (deli/prepared), or "leftover" (user-cooked/opened)

## PARSING EXAMPLES:
- "2 gallons of milk" → name: "Milk", modifier: "1 gallon", quantity: 2
- "organic chicken breasts" → name: "Chicken Breast", modifier: "Organic", quantity: 1
- "leftover pizza" → name: "Pizza", modifier: "Leftover", foodType: "leftover"
- "rotisserie chicken from costco" → name: "Rotisserie Chicken", modifier: "Costco", foodType: "premade"
- "eggs" → name: "Eggs", modifier: "", quantity: 1
- "baby spinach 5oz" → name: "Baby Spinach", modifier: "5oz", quantity: 1

## FOOD TYPE RULES:
- "store-bought": Default for packaged groceries (milk, cheese, packaged meat, produce)
- "premade": Deli items, rotisserie chicken, prepared foods, store-made salads
- "leftover": Keywords like "leftover", "cooked", "opened", "homemade"

Return ONLY valid JSON (no markdown) in this format:
{
  "items": [
    {
      "name": "Item Name",
      "modifier": "descriptors",
      "quantity": 1,
      "category": "Category",
      "foodType": "store-bought"
    }
  ]
}`;

async function parseItemsWithClaude(rawInput) {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1500,
    system: PARSE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Parse this grocery list:\n\n${rawInput}`
      }
    ]
  });

  let responseText = message.content.find(block => block.type === 'text')?.text;
  if (!responseText) {
    throw new Error("No text content in AI response");
  }

  // Strip markdown code blocks if present
  responseText = responseText.replace(/^```json\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

  return JSON.parse(responseText);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, rawText } = body;

    // Accept either array of items or raw text
    let inputText;
    if (rawText) {
      inputText = rawText;
    } else if (Array.isArray(items)) {
      inputText = items.join('\n');
    } else if (items) {
      inputText = items;
    } else {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    console.log(`📝 Stage 1: Parsing ${inputText.split('\n').length} items...`);

    const parsed = await parseItemsWithClaude(inputText);

    console.log(`✅ Parsed ${parsed.items.length} items`);

    return NextResponse.json({
      stage: 1,
      items: parsed.items,
      message: "Items parsed. Review and confirm before getting shelf life."
    });

  } catch (error) {
    console.error('❌ Error parsing items:', error);
    return NextResponse.json(
      { error: 'Failed to parse items', details: error.message },
      { status: 500 }
    );
  }
}
