import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { itemName } = await request.json();

    if (!itemName || !itemName.trim()) {
      return NextResponse.json({ error: 'Item name required' }, { status: 400 });
    }

    const cleanItemName = itemName.trim();
    console.log(`Getting quick shelf life answer for: ${cleanItemName}`);

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a friendly food safety expert providing quick, practical advice about food freshness and shelf life.

Item: ${cleanItemName}

Provide a helpful, conversational answer (2-3 sentences) about how long this item typically lasts and any important storage tips. Focus on practical home storage advice that consumers can easily follow.

SPECIAL ATTENTION: If this is a leftover item (like "leftover pizza", "leftover beef stew", etc.), provide guidance specific to cooked food storage - typically 3-4 days in the refrigerator.

Also determine the most likely category for this item.

Return JSON format:
{
  "name": "formatted item name",
  "category": "vegetables|fruits|meat|dairy|pantry|beverages|leftovers|bakery|frozen|other",
  "answer": "2-3 friendly sentences about shelf life and safety",
  "storageRecommendations": "brief storage tip",
  "shelfLifeDays": estimated_days_number
}

Example:
{
  "name": "Leftover Pizza",
  "category": "leftovers", 
  "answer": "Leftover pizza is best enjoyed within 3-4 days when stored in the refrigerator. Make sure to wrap it well or store in an airtight container to maintain quality and prevent it from drying out.",
  "storageRecommendations": "Store in refrigerator, wrap well or use airtight container",
  "shelfLifeDays": 4
}`
        }
      ]
    });

    const content = message.content[0].text;
    console.log("Raw Claude response:", content);

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", content);
      return NextResponse.json(
        { error: "Invalid AI response format", rawResponse: content },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log("Parsed quick answer result:", result);

    // Calculate expiry date for potential addition to list
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setDate(expiryDate.getDate() + (result.shelfLifeDays || 7));

    const enhancedResult = {
      ...result,
      purchaseDate: today.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      addedManually: true
    };

    return NextResponse.json(enhancedResult);

  } catch (error) {
    console.error('Error getting quick shelf life:', error);
    return NextResponse.json(
      { error: 'Failed to get shelf life information', details: error.message },
      { status: 500 }
    );
  }
}