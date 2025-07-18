import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { groceries } = await request.json();

    if (!groceries || groceries.length === 0) {
      return NextResponse.json({ error: 'No groceries provided' }, { status: 400 });
    }

    console.log(`Getting freshness information for ${groceries.length} grocery items...`);

    const groceryList = groceries.map(item => ({
      name: item.name,
      category: item.category,
      purchaseDate: item.purchaseDate,
      expiryDate: item.expiryDate,
      daysUntilExpiry: item.daysUntilExpiry,
      status: item.status
    }));

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 3000,
      messages: [
        {
          role: "user",
          content: `You are a practical food expert helping consumers understand the freshness of their groceries. 

Current grocery list:
${JSON.stringify(groceryList, null, 2)}

For each item, provide 1-2 sentences with specific, practical details about freshness and safety. Include variety-specific information when relevant.

Examples of the detail we want:
- "Bananas typically go bad in 4-5 days but are still safe to eat for 6-7 days if slightly overripe and spotted. Green bananas will last longer than yellow ones."
- "Ground beef should be used within 1-2 days for best quality and safety. Look for any grayish color or off smell as signs it's gone bad."
- "Fresh milk usually stays good for 5-7 days from purchase date. It may still be safe a day or two past expiry if it smells fresh and hasn't curdled."

Focus on:
- Realistic timeframes for home storage
- Signs to look for when food is going bad
- Safety vs quality differences when relevant
- Variety-specific guidance (ripeness levels, types, etc.)

Return JSON:
{
  "freshnessInfo": [
    {
      "itemName": "name",
      "details": "1-2 sentences with specific freshness and safety details"
    }
  ],
  "overallTips": [
    "general tip 1",
    "general tip 2"
  ]
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
    console.log("Parsed freshness result:", result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error getting freshness information:', error);
    return NextResponse.json(
      { error: 'Failed to get freshness information', details: error.message },
      { status: 500 }
    );
  }
}