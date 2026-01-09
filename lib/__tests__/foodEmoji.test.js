/**
 * Food Emoji Matching Tests
 *
 * Tests the emoji matching system against realistic grocery receipt inputs.
 * Each test set simulates different shopping scenarios with 4-20 items.
 *
 * Run with: npm test -- --testPathPattern=foodEmoji
 */

import { getFoodEmoji, debugEmojiMatch, getCategoryBgColor } from '../foodEmojis';

// =============================================================================
// TEST DATA: Realistic Grocery Receipt Items
// =============================================================================

// Test Set 1: Basic Grocery Run (12 items)
const basicGroceryRun = [
  { name: 'Gallon Whole Milk', category: 'Dairy', expected: '🥛' },
  { name: 'Large Eggs 18ct', category: 'Dairy', expected: '🥚' },
  { name: 'Bananas', category: 'Fruits', expected: '🍌' },
  { name: 'Sliced Bread White', category: 'Bakery', expected: '🍞' },
  { name: 'Ground Beef 80/20 1lb', category: 'Meat', expected: '🥩' },
  { name: 'Chicken Breast Boneless', category: 'Meat', expected: '🍗' },
  { name: 'Cheddar Cheese Block', category: 'Dairy', expected: '🧀' },
  { name: 'Orange Juice 64oz', category: 'Beverages', expected: '🧃' }, // compound phrase test
  { name: 'Baby Spinach 5oz', category: 'Vegetables', expected: '🥬' },
  { name: 'Greek Yogurt Vanilla', category: 'Dairy', expected: '🥛' }, // compound phrase test
  { name: 'Butter Salted 1lb', category: 'Dairy', expected: '🧈' },
  { name: 'Carrots Baby 1lb', category: 'Vegetables', expected: '🥕' },
];

// Test Set 2: Deli Counter Items (8 items)
const deliCounterItems = [
  { name: 'Honey Ham Sliced 1/2lb', category: 'Deli', expected: '🍖' },
  { name: 'Turkey Breast Smoked', category: 'Deli', expected: '🍗' },
  { name: 'Roast Beef Rare', category: 'Deli', expected: '🥩' },
  { name: 'Swiss Cheese Sliced', category: 'Deli', expected: '🧀' },
  { name: 'Chicken Salad 1/2lb', category: 'Deli', expected: '🥗' }, // compound phrase test
  { name: 'Potato Salad German', category: 'Deli', expected: '🥗' }, // compound phrase test
  { name: 'Salami Genoa', category: 'Deli', expected: '🥓' },
  { name: 'Pepperoni Sliced', category: 'Deli', expected: '🍕' },
];

// Test Set 3: Kroger Online Order (20 items - realistic web scrape)
const krogerOnlineOrder = [
  { name: 'Kroger 2% Reduced Fat Milk', category: 'Dairy', expected: '🥛' },
  { name: 'Simple Truth Organic Large Brown Eggs', category: 'Dairy', expected: '🥚' },
  { name: 'Dole Bananas', category: 'Fruits', expected: '🍌' },
  { name: 'Private Selection Artisan Sourdough Bread', category: 'Bakery', expected: '🍞' },
  { name: 'Kroger 93% Lean Ground Turkey', category: 'Meat', expected: '🍗' }, // compound phrase test
  { name: 'Tyson Boneless Skinless Chicken Thighs', category: 'Meat', expected: '🍗' },
  { name: 'Tillamook Medium Cheddar Cheese', category: 'Dairy', expected: '🧀' },
  { name: 'Simply Orange Pulp Free Orange Juice', category: 'Beverages', expected: '🧃' },
  { name: 'Earthbound Farm Organic Baby Spinach', category: 'Vegetables', expected: '🥬' },
  { name: 'Chobani Non-Fat Greek Yogurt Strawberry', category: 'Dairy', expected: '🥛' },
  { name: 'Land O Lakes Salted Butter', category: 'Dairy', expected: '🧈' },
  { name: 'Bolthouse Farms Baby Carrots', category: 'Vegetables', expected: '🥕' },
  { name: 'Driscoll\'s Strawberries 1lb', category: 'Fruits', expected: '🍓' },
  { name: 'Hass Avocados', category: 'Fruits', expected: '🥑' },
  { name: 'Red Bell Peppers', category: 'Vegetables', expected: '🫑' },
  { name: 'Yellow Onions 3lb Bag', category: 'Vegetables', expected: '🧅' },
  { name: 'Russet Potatoes 5lb', category: 'Vegetables', expected: '🥔' },
  { name: 'Philadelphia Cream Cheese Original', category: 'Dairy', expected: '🧀' }, // compound phrase
  { name: 'Oscar Mayer Turkey Bacon', category: 'Meat', expected: '🥓' },
  { name: 'Sabra Classic Hummus', category: 'Other', expected: '🍽️' }, // should fall back
];

// Test Set 4: Leftovers from Restaurants (6 items)
const restaurantLeftovers = [
  { name: 'Dominos Pizza (leftover from 2 days ago)', category: 'Other', expected: '🍕' },
  { name: 'Turkey Dinner (leftover from last night)', category: 'Other', expected: '🍗' },
  { name: 'Chipotle Burrito Bowl', category: 'Other', expected: '🌯' },
  { name: 'Panda Express Orange Chicken', category: 'Other', expected: '🍗' },
  { name: 'Subway Turkey Sandwich', category: 'Other', expected: '🥪' }, // sandwich keyword
  { name: 'Thai Pad Thai Noodles', category: 'Other', expected: '🍜' },
];

// Test Set 5: Prepared Foods Section (10 items)
const preparedFoods = [
  { name: 'Rotisserie Chicken Whole', category: 'Deli', expected: '🍗' },
  { name: 'Mac and Cheese Family Size', category: 'Deli', expected: '🧀' }, // compound phrase
  { name: 'Caesar Salad Kit', category: 'Deli', expected: '🥗' },
  { name: 'BBQ Ribs Half Rack', category: 'Deli', expected: '🍖' },
  { name: 'Beef Stew 16oz', category: 'Deli', expected: '🍲' },
  { name: 'Chicken Noodle Soup', category: 'Deli', expected: '🍲' },
  { name: 'Sushi California Roll 8pc', category: 'Deli', expected: '🍣' },
  { name: 'Fried Rice Vegetable', category: 'Deli', expected: '🍚' }, // compound phrase
  { name: 'Spring Rolls 4ct', category: 'Deli', expected: '🍽️' }, // should fall back
  { name: 'Grilled Cheese Sandwich', category: 'Deli', expected: '🧀' }, // compound phrase
];

// Test Set 6: Seafood Department (7 items)
const seafoodItems = [
  { name: 'Atlantic Salmon Fillet', category: 'Seafood', expected: '🍣' },
  { name: 'Jumbo Shrimp 21-25ct', category: 'Seafood', expected: '🦐' },
  { name: 'Cod Fillets Wild Caught', category: 'Seafood', expected: '🐟' },
  { name: 'Lobster Tails 2ct', category: 'Seafood', expected: '🦞' },
  { name: 'Crab Legs King', category: 'Seafood', expected: '🦀' },
  { name: 'Tuna Steaks Ahi', category: 'Seafood', expected: '🐟' },
  { name: 'Mussels Fresh 2lb', category: 'Seafood', expected: '🐟' }, // fallback to category
];

// Test Set 7: Breakfast Items (9 items)
const breakfastItems = [
  { name: 'Eggo Waffles Buttermilk', category: 'Frozen', expected: '🧇' },
  { name: 'Aunt Jemima Pancake Mix', category: 'Pantry', expected: '🥞' },
  { name: 'Oscar Mayer Bacon Thick Cut', category: 'Meat', expected: '🥓' },
  { name: 'Jimmy Dean Sausage Links', category: 'Meat', expected: '🌭' },
  { name: 'Thomas English Muffins', category: 'Bakery', expected: '🧁' },
  { name: 'Bagels Everything 6ct', category: 'Bakery', expected: '🥯' },
  { name: 'Cream Cheese Strawberry', category: 'Dairy', expected: '🧀' }, // compound phrase
  { name: 'Coffee Creamer French Vanilla', category: 'Dairy', expected: '☕' },
  { name: 'Fresh Squeezed Orange Juice', category: 'Beverages', expected: '🧃' },
];

// Test Set 8: International/Specialty Items (15 items) - Edge cases
const internationalItems = [
  { name: 'Pineapple Fresh Whole', category: 'Fruits', expected: '🍍' }, // NOT apple
  { name: 'Dragon Fruit', category: 'Fruits', expected: '🍎' }, // fallback
  { name: 'Miso Paste White', category: 'Pantry', expected: '🥫' }, // category fallback
  { name: 'Tofu Extra Firm', category: 'Other', expected: '🍽️' }, // no match
  { name: 'Kimchi Traditional', category: 'Other', expected: '🍽️' }, // no match
  { name: 'Coconut Milk Canned', category: 'Pantry', expected: '🥥' },
  { name: 'Sriracha Hot Sauce', category: 'Pantry', expected: '🥫' },
  { name: 'Peanut Butter Creamy', category: 'Pantry', expected: '🥜' }, // compound phrase
  { name: 'Almond Butter Organic', category: 'Pantry', expected: '🥜' }, // compound phrase
  { name: 'Rice Jasmine 5lb', category: 'Pantry', expected: '🍚' },
  { name: 'Ramen Noodles Instant', category: 'Pantry', expected: '🍜' },
  { name: 'Ice Cream Ben & Jerry\'s', category: 'Frozen', expected: '🍦' }, // compound phrase
  { name: 'Frozen Pizza DiGiorno', category: 'Frozen', expected: '🍕' },
  { name: 'Mango Frozen Chunks', category: 'Frozen', expected: '🥭' },
  { name: 'Edamame Shelled', category: 'Frozen', expected: '🧊' }, // category fallback
];

// Test Set 9: Snacks & Beverages (8 items)
const snacksBeverages = [
  { name: 'Coca-Cola 12pk', category: 'Beverages', expected: '🥤' }, // cola keyword
  { name: 'Starbucks Cold Brew Coffee', category: 'Beverages', expected: '☕' },
  { name: 'Lay\'s Potato Chips', category: 'Pantry', expected: '🥔' },
  { name: 'Oreo Cookies', category: 'Pantry', expected: '🍪' },
  { name: 'Hershey\'s Chocolate Bar', category: 'Pantry', expected: '🍫' },
  { name: 'Smartfood Popcorn', category: 'Pantry', expected: '🍿' },
  { name: 'Mixed Nuts Planters', category: 'Pantry', expected: '🥜' },
  { name: 'Red Wine Cabernet', category: 'Beverages', expected: '🍷' },
];

// Test Set 10: Edge Cases & Tricky Inputs (10 items)
const edgeCases = [
  { name: 'MILK 2% GAL', category: 'Dairy', expected: '🥛' }, // uppercase
  { name: 'org bnls sknls chkn brst', category: 'Meat', expected: '🍗' }, // abbreviations
  { name: 'Apple Cider Vinegar', category: 'Pantry', expected: '🍎' }, // apple in non-fruit
  { name: 'Honeycrisp Apples 3lb', category: 'Fruits', expected: '🍎' },
  { name: 'Grapefruit Ruby Red', category: 'Fruits', expected: '🍊' }, // grapefruit not grape
  { name: 'Grapes Red Seedless', category: 'Fruits', expected: '🍇' },
  { name: 'Hot Dog Buns', category: 'Bakery', expected: '🌭' }, // compound phrase
  { name: 'Bun Length Franks', category: 'Meat', expected: '🌭' }, // no match, should be sausage
  { name: 'Ice Cube Trays', category: 'Other', expected: '🧊' }, // ice keyword (non-food!)
  { name: '', category: 'Other', expected: '🍽️' }, // empty string
];

// =============================================================================
// TEST SUITES
// =============================================================================

describe('Food Emoji Matching System', () => {

  describe('Basic Grocery Run', () => {
    basicGroceryRun.forEach(({ name, category, expected }) => {
      test(`"${name}" → ${expected}`, () => {
        expect(getFoodEmoji(name, category)).toBe(expected);
      });
    });
  });

  describe('Deli Counter Items', () => {
    deliCounterItems.forEach(({ name, category, expected }) => {
      test(`"${name}" → ${expected}`, () => {
        expect(getFoodEmoji(name, category)).toBe(expected);
      });
    });
  });

  describe('Kroger Online Order (20 items)', () => {
    krogerOnlineOrder.forEach(({ name, category, expected }) => {
      test(`"${name}" → ${expected}`, () => {
        expect(getFoodEmoji(name, category)).toBe(expected);
      });
    });
  });

  describe('Restaurant Leftovers', () => {
    restaurantLeftovers.forEach(({ name, category, expected }) => {
      test(`"${name}" → ${expected}`, () => {
        expect(getFoodEmoji(name, category)).toBe(expected);
      });
    });
  });

  describe('Prepared Foods Section', () => {
    preparedFoods.forEach(({ name, category, expected }) => {
      test(`"${name}" → ${expected}`, () => {
        expect(getFoodEmoji(name, category)).toBe(expected);
      });
    });
  });

  describe('Seafood Department', () => {
    seafoodItems.forEach(({ name, category, expected }) => {
      test(`"${name}" → ${expected}`, () => {
        expect(getFoodEmoji(name, category)).toBe(expected);
      });
    });
  });

  describe('Breakfast Items', () => {
    breakfastItems.forEach(({ name, category, expected }) => {
      test(`"${name}" → ${expected}`, () => {
        expect(getFoodEmoji(name, category)).toBe(expected);
      });
    });
  });

  describe('International/Specialty Items', () => {
    internationalItems.forEach(({ name, category, expected }) => {
      test(`"${name}" → ${expected}`, () => {
        expect(getFoodEmoji(name, category)).toBe(expected);
      });
    });
  });

  describe('Snacks & Beverages', () => {
    snacksBeverages.forEach(({ name, category, expected }) => {
      test(`"${name}" → ${expected}`, () => {
        expect(getFoodEmoji(name, category)).toBe(expected);
      });
    });
  });

  describe('Edge Cases & Tricky Inputs', () => {
    edgeCases.forEach(({ name, category, expected }) => {
      test(`"${name || '(empty)'}" → ${expected}`, () => {
        expect(getFoodEmoji(name, category)).toBe(expected);
      });
    });
  });

  // Compound phrase priority tests
  describe('Compound Phrase Priority', () => {
    test('orange juice → 🧃 (not 🍊)', () => {
      expect(getFoodEmoji('Orange Juice', 'Beverages')).toBe('🧃');
    });

    test('ice cream → 🍦 (not 🧊)', () => {
      expect(getFoodEmoji('Ice Cream', 'Frozen')).toBe('🍦');
    });

    test('peanut butter → 🥜', () => {
      expect(getFoodEmoji('Peanut Butter', 'Pantry')).toBe('🥜');
    });

    test('chicken salad → 🥗 (not 🍗)', () => {
      expect(getFoodEmoji('Chicken Salad', 'Deli')).toBe('🥗');
    });

    test('cream cheese → 🧀 (not 🥛)', () => {
      expect(getFoodEmoji('Cream Cheese', 'Dairy')).toBe('🧀');
    });
  });

  // Longer keyword priority tests
  describe('Longer Keyword Priority', () => {
    test('pineapple → 🍍 (not 🍎 from "apple")', () => {
      expect(getFoodEmoji('Pineapple', 'Fruits')).toBe('🍍');
    });

    test('grapefruit → 🍊 (not 🍇 from "grape")', () => {
      expect(getFoodEmoji('Grapefruit', 'Fruits')).toBe('🍊');
    });

    test('strawberry → 🍓 (not generic berry)', () => {
      expect(getFoodEmoji('Strawberry', 'Fruits')).toBe('🍓');
    });
  });

  // Category fallback tests
  describe('Category Fallback', () => {
    test('unknown dairy item falls back to 🥛', () => {
      expect(getFoodEmoji('Kefir Probiotic', 'Dairy')).toBe('🥛');
    });

    test('unknown meat item falls back to 🥩', () => {
      expect(getFoodEmoji('Venison Steak', 'Meat')).toBe('🥩');
    });

    test('unknown vegetable falls back to 🥬', () => {
      expect(getFoodEmoji('Bok Choy', 'Vegetables')).toBe('🥬');
    });

    test('completely unknown item falls back to 🍽️', () => {
      expect(getFoodEmoji('Xyzzy Food Product', null)).toBe('🍽️');
    });
  });

  // Debug helper tests
  describe('Debug Helper', () => {
    test('returns match type for compound phrase', () => {
      const result = debugEmojiMatch('Orange Juice', 'Beverages');
      expect(result.matchType).toBe('compound');
      expect(result.matched).toBe('orange juice');
    });

    test('returns match type for keyword', () => {
      const result = debugEmojiMatch('Banana', 'Fruits');
      expect(result.matchType).toBe('keyword');
      expect(result.matched).toBe('banana');
    });

    test('returns match type for category fallback', () => {
      const result = debugEmojiMatch('Unknown Dairy Item', 'Dairy');
      expect(result.matchType).toBe('category');
      expect(result.matched).toBe('Dairy');
    });
  });

  // Background color tests
  describe('Category Background Colors', () => {
    test('Dairy → bg-sky-50', () => {
      expect(getCategoryBgColor('Dairy')).toBe('bg-sky-50');
    });

    test('Meat → bg-rose-50', () => {
      expect(getCategoryBgColor('Meat')).toBe('bg-rose-50');
    });

    test('Unknown → bg-slate-50', () => {
      expect(getCategoryBgColor('Unknown')).toBe('bg-slate-50');
    });
  });
});

// =============================================================================
// ACCURACY REPORT
// =============================================================================

describe('Accuracy Report', () => {
  const allTestSets = [
    { name: 'Basic Grocery Run', items: basicGroceryRun },
    { name: 'Deli Counter Items', items: deliCounterItems },
    { name: 'Kroger Online Order', items: krogerOnlineOrder },
    { name: 'Restaurant Leftovers', items: restaurantLeftovers },
    { name: 'Prepared Foods', items: preparedFoods },
    { name: 'Seafood', items: seafoodItems },
    { name: 'Breakfast Items', items: breakfastItems },
    { name: 'International/Specialty', items: internationalItems },
    { name: 'Snacks & Beverages', items: snacksBeverages },
    { name: 'Edge Cases', items: edgeCases },
  ];

  test('generates accuracy report', () => {
    let totalItems = 0;
    let correctMatches = 0;
    const failures = [];

    allTestSets.forEach(({ name, items }) => {
      items.forEach(({ name: itemName, category, expected }) => {
        totalItems++;
        const actual = getFoodEmoji(itemName, category);
        if (actual === expected) {
          correctMatches++;
        } else {
          failures.push({ set: name, item: itemName, expected, actual });
        }
      });
    });

    const accuracy = ((correctMatches / totalItems) * 100).toFixed(1);

    console.log('\n=== EMOJI MATCHING ACCURACY REPORT ===');
    console.log(`Total Items: ${totalItems}`);
    console.log(`Correct Matches: ${correctMatches}`);
    console.log(`Accuracy: ${accuracy}%`);

    if (failures.length > 0) {
      console.log(`\nFailures (${failures.length}):`);
      failures.forEach(f => {
        console.log(`  - [${f.set}] "${f.item}": expected ${f.expected}, got ${f.actual}`);
      });
    }

    // We expect at least 85% accuracy
    expect(parseFloat(accuracy)).toBeGreaterThanOrEqual(85);
  });
});
