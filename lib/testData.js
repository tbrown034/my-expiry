/**
 * Test Data for Development Testing
 *
 * Provides random grocery items for testing the AI parsing pipeline.
 * Items are pulled from realistic grocery receipt scenarios.
 */

// All test items from various shopping scenarios
const testItems = [
  // Basic Grocery Run
  'Gallon Whole Milk',
  'Large Eggs 18ct',
  'Bananas',
  'Sliced Bread White',
  'Ground Beef 80/20 1lb',
  'Chicken Breast Boneless',
  'Cheddar Cheese Block',
  'Orange Juice 64oz',
  'Baby Spinach 5oz',
  'Greek Yogurt Vanilla',
  'Butter Salted 1lb',
  'Carrots Baby 1lb',

  // Deli Counter
  'Honey Ham Sliced 1/2lb',
  'Turkey Breast Smoked',
  'Roast Beef Rare',
  'Swiss Cheese Sliced',
  'Chicken Salad 1/2lb',
  'Potato Salad German',
  'Salami Genoa',

  // Kroger Style
  'Kroger 2% Reduced Fat Milk',
  'Simple Truth Organic Large Brown Eggs',
  'Dole Bananas',
  'Private Selection Artisan Sourdough Bread',
  'Kroger 93% Lean Ground Turkey',
  'Tyson Boneless Skinless Chicken Thighs',
  'Tillamook Medium Cheddar Cheese',
  'Simply Orange Pulp Free Orange Juice',
  'Earthbound Farm Organic Baby Spinach',
  'Chobani Non-Fat Greek Yogurt Strawberry',
  'Land O Lakes Salted Butter',
  'Bolthouse Farms Baby Carrots',
  'Driscoll\'s Strawberries 1lb',
  'Hass Avocados',
  'Red Bell Peppers',
  'Yellow Onions 3lb Bag',
  'Russet Potatoes 5lb',
  'Philadelphia Cream Cheese Original',
  'Oscar Mayer Turkey Bacon',

  // Leftovers
  'Dominos Pizza (leftover)',
  'Turkey Dinner (leftover)',
  'Chipotle Burrito Bowl',
  'Panda Express Orange Chicken',
  'Subway Turkey Sandwich',
  'Thai Pad Thai Noodles',

  // Prepared Foods
  'Rotisserie Chicken Whole',
  'Mac and Cheese Family Size',
  'Caesar Salad Kit',
  'BBQ Ribs Half Rack',
  'Beef Stew 16oz',
  'Chicken Noodle Soup',
  'Sushi California Roll 8pc',
  'Fried Rice Vegetable',
  'Grilled Cheese Sandwich',

  // Seafood
  'Atlantic Salmon Fillet',
  'Jumbo Shrimp 21-25ct',
  'Cod Fillets Wild Caught',
  'Lobster Tails 2ct',
  'Crab Legs King',
  'Tuna Steaks Ahi',

  // Breakfast
  'Eggo Waffles Buttermilk',
  'Aunt Jemima Pancake Mix',
  'Oscar Mayer Bacon Thick Cut',
  'Jimmy Dean Sausage Links',
  'Thomas English Muffins',
  'Bagels Everything 6ct',
  'Cream Cheese Strawberry',
  'Coffee Creamer French Vanilla',

  // International
  'Pineapple Fresh Whole',
  'Dragon Fruit',
  'Tofu Extra Firm',
  'Kimchi Traditional',
  'Coconut Milk Canned',
  'Peanut Butter Creamy',
  'Rice Jasmine 5lb',
  'Ramen Noodles Instant',
  'Ice Cream Ben & Jerry\'s',
  'Frozen Pizza DiGiorno',
  'Mango Frozen Chunks',

  // Snacks & Beverages
  'Coca-Cola 12pk',
  'Starbucks Cold Brew Coffee',
  'Lay\'s Potato Chips',
  'Oreo Cookies',
  'Hershey\'s Chocolate Bar',
  'Smartfood Popcorn',
  'Mixed Nuts Planters',
  'Red Wine Cabernet',

  // Edge Cases
  'MILK 2% GAL',
  'org bnls sknls chkn brst',
  'Apple Cider Vinegar',
  'Honeycrisp Apples 3lb',
  'Grapefruit Ruby Red',
  'Grapes Red Seedless',
  'Hot Dog Buns',
  'Bun Length Franks',
];

/**
 * Get a random selection of test items
 * @param {number} count - Number of items to return (default: random 5-12)
 * @returns {string[]} Array of item names
 */
export function getRandomTestItems(count = null) {
  // If no count specified, pick random between 5-12
  const itemCount = count ?? Math.floor(Math.random() * 8) + 5;

  // Shuffle and pick
  const shuffled = [...testItems].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(itemCount, testItems.length));
}

/**
 * Get all test items (for comprehensive testing)
 * @returns {string[]} All test items
 */
export function getAllTestItems() {
  return [...testItems];
}
