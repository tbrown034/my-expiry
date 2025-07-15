import { NextResponse } from 'next/server';
import { getShelfLife, calculateExpiryDate } from '../../../lib/utils';

const inferCategory = (itemName) => {
  const name = itemName.toLowerCase();
  
  // Dairy
  if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || 
      name.includes('butter') || name.includes('cream') || name.includes('egg')) {
    return 'dairy';
  }
  
  // Meat
  if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || 
      name.includes('fish') || name.includes('turkey') || name.includes('meat') ||
      name.includes('bacon') || name.includes('sausage')) {
    return 'meat';
  }
  
  // Fruits
  if (name.includes('apple') || name.includes('banana') || name.includes('orange') ||
      name.includes('berry') || name.includes('grape') || name.includes('fruit') ||
      name.includes('avocado') || name.includes('tomato')) {
    return 'fruits';
  }
  
  // Vegetables
  if (name.includes('lettuce') || name.includes('carrot') || name.includes('potato') ||
      name.includes('onion') || name.includes('pepper') || name.includes('spinach') ||
      name.includes('vegetable') || name.includes('celery') || name.includes('broccoli')) {
    return 'vegetables';
  }
  
  // Bakery
  if (name.includes('bread') || name.includes('bagel') || name.includes('roll') ||
      name.includes('muffin') || name.includes('pastry')) {
    return 'bakery';
  }
  
  // Frozen
  if (name.includes('frozen') || name.includes('ice cream')) {
    return 'frozen';
  }
  
  // Beverages
  if (name.includes('juice') || name.includes('soda') || name.includes('water') ||
      name.includes('coffee') || name.includes('tea') || name.includes('drink')) {
    return 'beverages';
  }
  
  // Pantry
  if (name.includes('cereal') || name.includes('pasta') || name.includes('rice') ||
      name.includes('can') || name.includes('sauce') || name.includes('oil')) {
    return 'pantry';
  }
  
  return 'other';
};

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

    if (isBatch) {
      const processedItems = items.map(item => {
        const cleanName = item.trim();
        const category = inferCategory(cleanName);
        const shelfLifeDays = getShelfLife(cleanName, category);
        const expiryDate = calculateExpiryDate(today, cleanName, category);
        
        return {
          name: cleanName,
          category,
          shelfLifeDays,
          estimatedCategory: category,
          purchaseDate: today,
          expiryDate
        };
      });

      return NextResponse.json({ items: processedItems });
    } else {
      const cleanName = itemName.trim();
      const category = inferCategory(cleanName);
      const shelfLifeDays = getShelfLife(cleanName, category);
      const expiryDate = calculateExpiryDate(today, cleanName, category);
      
      return NextResponse.json({
        name: cleanName,
        category,
        shelfLifeDays,
        estimatedCategory: category,
        purchaseDate: today,
        expiryDate
      });
    }

  } catch (error) {
    console.error('Error getting shelf life:', error);
    return NextResponse.json(
      { error: 'Failed to get shelf life information' },
      { status: 500 }
    );
  }
}