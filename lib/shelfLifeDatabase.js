/**
 * Consolidated USDA FoodKeeper + FDA Food Safety Database
 *
 * SOURCES:
 * - USDA FoodKeeper App: https://www.foodsafety.gov/keep-food-safe/foodkeeper-app
 * - FDA Food Safety: https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling
 * - USDA FSIS: https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation
 *
 * DATA FORMAT: Static JSON snapshot (not a live database connection)
 * LAST VERIFIED: January 2026
 * UPDATE FREQUENCY: Manual updates as USDA guidelines change
 *
 * NOTE: This data represents CONSERVATIVE estimates for food safety.
 * Actual shelf life may vary based on storage conditions, packaging,
 * and initial quality. When in doubt, follow the "when in doubt, throw it out" rule.
 *
 * This is the single source of truth for shelf life data.
 * Used by both local parsing and AI fallback.
 */

// Metadata about this data snapshot
export const DATA_METADATA = {
  lastUpdated: '2026-01-09',
  version: '1.0.0',
  sources: [
    {
      name: 'USDA FoodKeeper',
      url: 'https://www.foodsafety.gov/keep-food-safe/foodkeeper-app',
      description: 'Official USDA food storage guidelines'
    },
    {
      name: 'FDA Food Safety',
      url: 'https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling',
      description: 'FDA safe food handling guidelines'
    },
    {
      name: 'USDA FSIS',
      url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation',
      description: 'Food Safety and Inspection Service guidelines'
    }
  ],
  disclaimer: 'This is a static snapshot of publicly available government data. For the most current guidelines, please visit the official sources linked above.',
  itemCount: 0, // Will be calculated
};

// Shelf life in days (refrigerator storage)
export const SHELF_LIFE_DATABASE = {
  // ==================== DAIRY ====================
  // Misspelling variants included for common typos
  milk: { days: 7, category: 'Dairy', source: 'USDA', keywords: ['milk', '2%', 'skim', 'whole milk', 'oat milk', 'almond milk', 'milke', 'mlk'] },
  eggs: { days: 35, category: 'Dairy', source: 'USDA', keywords: ['eggs', 'egg', 'dozen eggs', 'egs', 'egss'] },
  butter: { days: 90, category: 'Dairy', source: 'USDA', keywords: ['butter', 'margarine', 'buttter', 'buttr', 'butr'] },
  yogurt: { days: 14, category: 'Dairy', source: 'USDA', keywords: ['yogurt', 'greek yogurt', 'yoghurt', 'yogart', 'yougurt', 'yorgurt', 'yogrit'] },
  cheese_hard: { days: 180, category: 'Dairy', source: 'USDA', keywords: ['parmesan', 'cheddar', 'gouda', 'swiss', 'parmesean', 'cheder', 'chedar'] },
  cheese_soft: { days: 14, category: 'Dairy', source: 'USDA', keywords: ['brie', 'feta', 'goat cheese', 'mozzarella', 'mozarella', 'mozzarela', 'mozzerella'] },
  cream_cheese: { days: 14, category: 'Dairy', source: 'USDA', keywords: ['cream cheese', 'philadelphia', 'creamcheese', 'cream cheeze'] },
  sour_cream: { days: 21, category: 'Dairy', source: 'USDA', keywords: ['sour cream', 'sourcream', 'sour creme', 'sourecream'] },
  cottage_cheese: { days: 7, category: 'Dairy', source: 'USDA', keywords: ['cottage cheese', 'cottagecheese', 'cottage cheeze'] },
  heavy_cream: { days: 10, category: 'Dairy', source: 'USDA', keywords: ['heavy cream', 'whipping cream', 'cream', 'heavycream', 'whippingcream'] },
  half_and_half: { days: 7, category: 'Dairy', source: 'USDA', keywords: ['half and half', 'half & half', 'halfandhalf', 'half n half'] },
  cheese: { days: 21, category: 'Dairy', source: 'USDA', keywords: ['cheese', 'cheeze', 'chese', 'cheez'] },

  // ==================== MEAT - RAW ====================
  chicken_raw: { days: 2, category: 'Meat', source: 'USDA', keywords: ['chicken', 'chicken breast', 'chicken thigh', 'chicken wing', 'whole chicken'] },
  turkey_raw: { days: 2, category: 'Meat', source: 'USDA', keywords: ['turkey', 'turkey breast', 'ground turkey'] },
  beef_raw: { days: 5, category: 'Meat', source: 'USDA', keywords: ['beef', 'steak', 'roast', 'ribeye', 'sirloin', 'filet'] },
  ground_beef: { days: 2, category: 'Meat', source: 'USDA', keywords: ['ground beef', 'hamburger meat', 'ground chuck'] },
  pork_raw: { days: 5, category: 'Meat', source: 'USDA', keywords: ['pork', 'pork chop', 'pork loin', 'pork tenderloin'] },
  ground_pork: { days: 2, category: 'Meat', source: 'USDA', keywords: ['ground pork', 'pork sausage'] },
  lamb: { days: 5, category: 'Meat', source: 'USDA', keywords: ['lamb', 'lamb chop', 'leg of lamb'] },
  fish_raw: { days: 2, category: 'Meat', source: 'USDA', keywords: ['fish', 'salmon', 'tilapia', 'cod', 'tuna', 'halibut', 'trout'] },
  shrimp_raw: { days: 2, category: 'Meat', source: 'USDA', keywords: ['shrimp', 'prawns'] },
  shellfish: { days: 2, category: 'Meat', source: 'USDA', keywords: ['crab', 'lobster', 'clams', 'mussels', 'oysters', 'scallops'] },
  bacon: { days: 7, category: 'Meat', source: 'USDA', keywords: ['bacon'] },
  sausage: { days: 2, category: 'Meat', source: 'USDA', keywords: ['sausage', 'italian sausage', 'breakfast sausage'] },
  hot_dogs: { days: 14, category: 'Meat', source: 'USDA', keywords: ['hot dogs', 'frankfurters', 'wieners'] },
  deli_meat: { days: 5, category: 'Meat', source: 'USDA', keywords: ['deli meat', 'lunch meat', 'ham', 'turkey slices', 'salami', 'bologna', 'pastrami'] },

  // ==================== MEAT - COOKED/LEFTOVERS ====================
  cooked_meat: { days: 4, category: 'Meat', source: 'FDA', keywords: ['cooked chicken', 'cooked beef', 'cooked pork', 'leftover meat'] },
  rotisserie_chicken: { days: 4, category: 'Meat', source: 'USDA', keywords: ['rotisserie chicken', 'rotisserie'] },
  leftover: { days: 4, category: 'Other', source: 'FDA', keywords: ['leftover', 'leftovers'] },
  soup: { days: 4, category: 'Other', source: 'USDA', keywords: ['soup', 'stew', 'chili'] },
  pizza_leftover: { days: 4, category: 'Other', source: 'USDA', keywords: ['leftover pizza', 'pizza'] },

  // ==================== PRODUCE - VEGETABLES ====================
  // Misspelling variants included for common typos
  lettuce: { days: 7, category: 'Vegetables', source: 'USDA', keywords: ['lettuce', 'romaine', 'iceberg', 'mixed greens', 'salad mix', 'letuce', 'lettice'] },
  spinach: { days: 5, category: 'Vegetables', source: 'USDA', keywords: ['spinach', 'baby spinach', 'spinich', 'spinish'] },
  kale: { days: 7, category: 'Vegetables', source: 'USDA', keywords: ['kale', 'kail'] },
  arugula: { days: 5, category: 'Vegetables', source: 'USDA', keywords: ['arugula', 'rocket', 'argula', 'arugala'] },
  broccoli: { days: 5, category: 'Vegetables', source: 'USDA', keywords: ['broccoli', 'brocoli', 'brocolli', 'broccolli'] },
  cauliflower: { days: 7, category: 'Vegetables', source: 'USDA', keywords: ['cauliflower', 'calliflower', 'califlower', 'cauliflour', 'colliflower'] },
  carrots: { days: 21, category: 'Vegetables', source: 'USDA', keywords: ['carrots', 'carrot', 'baby carrots', 'carots', 'carrott'] },
  celery: { days: 14, category: 'Vegetables', source: 'USDA', keywords: ['celery', 'cellery', 'celary'] },
  cucumber: { days: 7, category: 'Vegetables', source: 'USDA', keywords: ['cucumber', 'cucumbers', 'cuccumber', 'cucmber'] },
  tomatoes: { days: 7, category: 'Vegetables', source: 'USDA', keywords: ['tomato', 'tomatoes', 'cherry tomatoes', 'grape tomatoes', 'tomatoe', 'tomatos', 'tomatoe', 'tomatto'] },
  peppers: { days: 7, category: 'Vegetables', source: 'USDA', keywords: ['pepper', 'bell pepper', 'peppers', 'jalapeño', 'jalapeno', 'peper', 'peppers'] },
  onions: { days: 60, category: 'Vegetables', source: 'USDA', keywords: ['onion', 'onions', 'red onion', 'yellow onion', 'oinion', 'onoin'] },
  garlic: { days: 60, category: 'Vegetables', source: 'USDA', keywords: ['garlic', 'garlick', 'garlik'] },
  potatoes: { days: 21, category: 'Vegetables', source: 'USDA', keywords: ['potato', 'potatoes', 'russet', 'yukon gold', 'potatos', 'potatoe', 'potatow', 'potatto'] },
  sweet_potatoes: { days: 21, category: 'Vegetables', source: 'USDA', keywords: ['sweet potato', 'sweet potatoes', 'yam', 'sweetpotato', 'yams'] },
  mushrooms: { days: 7, category: 'Vegetables', source: 'USDA', keywords: ['mushroom', 'mushrooms', 'portobello', 'cremini', 'mushroms', 'muchrooms', 'shrooms'] },
  zucchini: { days: 7, category: 'Vegetables', source: 'USDA', keywords: ['zucchini', 'squash', 'yellow squash', 'zuchini', 'zuccini', 'zuchinni', 'zukini'] },
  asparagus: { days: 5, category: 'Vegetables', source: 'USDA', keywords: ['asparagus', 'aspargus', 'asperagus', 'aspargaus', 'asparugus'] },
  green_beans: { days: 7, category: 'Vegetables', source: 'USDA', keywords: ['green beans', 'string beans', 'greenbeans', 'stringbeans'] },
  corn: { days: 5, category: 'Vegetables', source: 'USDA', keywords: ['corn', 'corn on the cob', 'sweet corn', 'sweetcorn'] },
  avocado: { days: 5, category: 'Vegetables', source: 'USDA', keywords: ['avocado', 'avocados', 'avacado', 'avacodos', 'avocodo'] },
  parsley: { days: 14, category: 'Vegetables', source: 'USDA', keywords: ['parsley', 'parsely', 'parsly', 'parslely', 'fresh parsley'] },
  cilantro: { days: 7, category: 'Vegetables', source: 'USDA', keywords: ['cilantro', 'cilanto', 'cilantrow', 'coriander'] },
  bok_choy: { days: 5, category: 'Vegetables', source: 'USDA', keywords: ['bok choy', 'bokchoy', 'bok choi', 'pak choi', 'pak choy'] },
  brussels_sprouts: { days: 7, category: 'Vegetables', source: 'USDA', keywords: ['brussels sprouts', 'brussel sprouts', 'brusselsprouts', 'brussels', 'brussel'] },
  edamame: { days: 5, category: 'Vegetables', source: 'USDA', keywords: ['edamame', 'edamamme', 'edmame'] },
  jicama: { days: 14, category: 'Vegetables', source: 'USDA', keywords: ['jicama', 'jicima', 'hikama'] },

  // ==================== PRODUCE - FRUITS ====================
  // Misspelling variants included for common typos
  apples: { days: 28, category: 'Fruits', source: 'USDA', keywords: ['apple', 'apples', 'gala', 'fuji', 'honeycrisp', 'granny smith', 'aples', 'appels'] },
  bananas: { days: 5, category: 'Fruits', source: 'USDA', keywords: ['banana', 'bananas', 'banannas', 'bannana', 'banna', 'bannanas'] },
  oranges: { days: 21, category: 'Fruits', source: 'USDA', keywords: ['orange', 'oranges', 'navel orange', 'mandarin', 'tangerine', 'clementine', 'clementines', 'orang', 'oragne'] },
  lemons: { days: 28, category: 'Fruits', source: 'USDA', keywords: ['lemon', 'lemons', 'lemmons', 'lemmon'] },
  limes: { days: 28, category: 'Fruits', source: 'USDA', keywords: ['lime', 'limes', 'lyme', 'lymes'] },
  grapes: { days: 14, category: 'Fruits', source: 'USDA', keywords: ['grapes', 'grape', 'graeps', 'graps'] },
  strawberries: { days: 5, category: 'Fruits', source: 'USDA', keywords: ['strawberry', 'strawberries', 'strawberrys', 'strawberies', 'stawberries', 'stawberry'] },
  blueberries: { days: 7, category: 'Fruits', source: 'USDA', keywords: ['blueberry', 'blueberries', 'bluberries', 'blueberrys', 'bluberry', 'blueberrries'] },
  raspberries: { days: 3, category: 'Fruits', source: 'USDA', keywords: ['raspberry', 'raspberries', 'rasberries', 'raspberrys', 'rasberry', 'rasberrie'] },
  blackberries: { days: 3, category: 'Fruits', source: 'USDA', keywords: ['blackberry', 'blackberries', 'blackberrys', 'blackberies'] },
  berries: { days: 5, category: 'Fruits', source: 'USDA', keywords: ['berries', 'mixed berries', 'berrys', 'berry', 'berry mix'] },
  peaches: { days: 5, category: 'Fruits', source: 'USDA', keywords: ['peach', 'peaches', 'peachs', 'peche'] },
  plums: { days: 5, category: 'Fruits', source: 'USDA', keywords: ['plum', 'plums', 'plumbs'] },
  pears: { days: 7, category: 'Fruits', source: 'USDA', keywords: ['pear', 'pears', 'pares', 'pare'] },
  cherries: { days: 7, category: 'Fruits', source: 'USDA', keywords: ['cherry', 'cherries', 'cherrys', 'cherrries'] },
  watermelon: { days: 7, category: 'Fruits', source: 'USDA', keywords: ['watermelon', 'watermellon', 'water melon', 'watermelons'] },
  cantaloupe: { days: 5, category: 'Fruits', source: 'USDA', keywords: ['cantaloupe', 'melon', 'cantalope', 'cantelope', 'cantaloup'] },
  pineapple: { days: 5, category: 'Fruits', source: 'USDA', keywords: ['pineapple', 'pinapple', 'pinneaple', 'pineaple', 'pinneapple'] },
  mango: { days: 5, category: 'Fruits', source: 'USDA', keywords: ['mango', 'mangoes', 'mangos', 'manago'] },
  kiwi: { days: 7, category: 'Fruits', source: 'USDA', keywords: ['kiwi', 'kiwifruit', 'kiwis', 'keewee'] },
  dragonfruit: { days: 5, category: 'Fruits', source: 'USDA', keywords: ['dragonfruit', 'dragon fruit', 'pitaya'] },
  lychee: { days: 7, category: 'Fruits', source: 'USDA', keywords: ['lychee', 'litchi', 'lichi', 'lichee'] },
  passionfruit: { days: 7, category: 'Fruits', source: 'USDA', keywords: ['passionfruit', 'passion fruit', 'passonfruit'] },
  starfruit: { days: 7, category: 'Fruits', source: 'USDA', keywords: ['starfruit', 'star fruit', 'carambola'] },
  pomegranate: { days: 14, category: 'Fruits', source: 'USDA', keywords: ['pomegranate', 'pomegranite', 'pomegranates', 'pomegranate seeds', 'pomegranite seeds'] },

  // ==================== BAKERY ====================
  bread: { days: 7, category: 'Bakery', source: 'USDA', keywords: ['bread', 'loaf', 'sliced bread', 'white bread', 'wheat bread', 'sourdough'] },
  bagels: { days: 5, category: 'Bakery', source: 'USDA', keywords: ['bagel', 'bagels'] },
  tortillas: { days: 14, category: 'Bakery', source: 'USDA', keywords: ['tortilla', 'tortillas', 'wrap', 'wraps'] },
  english_muffins: { days: 7, category: 'Bakery', source: 'USDA', keywords: ['english muffin', 'english muffins'] },
  rolls: { days: 5, category: 'Bakery', source: 'USDA', keywords: ['roll', 'rolls', 'dinner rolls', 'buns', 'hamburger buns', 'hot dog buns'] },
  pastry: { days: 3, category: 'Bakery', source: 'USDA', keywords: ['pastry', 'croissant', 'danish', 'muffin', 'scone'] },
  cake: { days: 5, category: 'Bakery', source: 'USDA', keywords: ['cake'] },
  pie: { days: 4, category: 'Bakery', source: 'USDA', keywords: ['pie'] },

  // ==================== DELI/PREPARED ====================
  deli_salad: { days: 4, category: 'Other', source: 'USDA', keywords: ['deli salad', 'potato salad', 'coleslaw', 'macaroni salad'] },
  hummus: { days: 7, category: 'Other', source: 'USDA', keywords: ['hummus'] },
  guacamole: { days: 3, category: 'Other', source: 'USDA', keywords: ['guacamole', 'guac'] },
  salsa: { days: 14, category: 'Other', source: 'USDA', keywords: ['salsa'] },
  dip: { days: 7, category: 'Other', source: 'USDA', keywords: ['dip', 'ranch dip', 'spinach dip'] },
  prepared_meal: { days: 4, category: 'Other', source: 'FDA', keywords: ['prepared meal', 'ready meal', 'meal kit'] },
  sushi: { days: 1, category: 'Other', source: 'FDA', keywords: ['sushi', 'sashimi'] },

  // ==================== BEVERAGES ====================
  juice: { days: 7, category: 'Beverages', source: 'USDA', keywords: ['juice', 'orange juice', 'apple juice', 'oj'] },
  fresh_juice: { days: 3, category: 'Beverages', source: 'USDA', keywords: ['fresh juice', 'cold pressed', 'smoothie'] },

  // ==================== CONDIMENTS (opened) ====================
  mayo: { days: 60, category: 'Pantry', source: 'USDA', keywords: ['mayo', 'mayonnaise'] },
  ketchup: { days: 180, category: 'Pantry', source: 'USDA', keywords: ['ketchup'] },
  mustard: { days: 365, category: 'Pantry', source: 'USDA', keywords: ['mustard'] },
  salad_dressing: { days: 60, category: 'Pantry', source: 'USDA', keywords: ['dressing', 'salad dressing', 'ranch', 'vinaigrette'] },
  peanut_butter: { days: 90, category: 'Pantry', source: 'USDA', keywords: ['peanut butter'] },
  jam: { days: 90, category: 'Pantry', source: 'USDA', keywords: ['jam', 'jelly', 'preserves'] },
};

/**
 * Build a reverse lookup map for fast keyword matching
 */
const buildKeywordMap = () => {
  const map = new Map();

  for (const [key, data] of Object.entries(SHELF_LIFE_DATABASE)) {
    // Add all keywords
    for (const keyword of data.keywords) {
      const normalized = keyword.toLowerCase().trim();
      if (!map.has(normalized)) {
        map.set(normalized, []);
      }
      map.get(normalized).push({ key, ...data });
    }
  }

  return map;
};

const KEYWORD_MAP = buildKeywordMap();

/**
 * Look up shelf life for an item by name
 * Returns match with highest confidence
 *
 * @param {string} itemName - The item name to look up
 * @returns {{ found: boolean, data?: object, confidence: 'high'|'medium'|'low', matchedKey?: string }}
 */
export function lookupShelfLife(itemName) {
  if (!itemName || typeof itemName !== 'string') {
    return { found: false, confidence: 'low' };
  }

  const normalized = itemName.toLowerCase().trim();

  // 1. Exact match on keyword
  if (KEYWORD_MAP.has(normalized)) {
    const matches = KEYWORD_MAP.get(normalized);
    return {
      found: true,
      data: matches[0],
      confidence: 'high',
      matchedKey: matches[0].key
    };
  }

  // 2. Check if item contains any keyword (longest match first)
  const allKeywords = Array.from(KEYWORD_MAP.keys()).sort((a, b) => b.length - a.length);

  for (const keyword of allKeywords) {
    if (normalized.includes(keyword)) {
      const matches = KEYWORD_MAP.get(keyword);
      return {
        found: true,
        data: matches[0],
        confidence: 'medium',
        matchedKey: matches[0].key
      };
    }
  }

  // 3. Check if any keyword contains the item (for abbreviated inputs)
  for (const keyword of allKeywords) {
    if (keyword.includes(normalized) && normalized.length >= 3) {
      const matches = KEYWORD_MAP.get(keyword);
      return {
        found: true,
        data: matches[0],
        confidence: 'medium',
        matchedKey: matches[0].key
      };
    }
  }

  // 4. Not found
  return { found: false, confidence: 'low' };
}

/**
 * Get all available categories
 */
export const CATEGORIES = ['Dairy', 'Meat', 'Vegetables', 'Fruits', 'Bakery', 'Beverages', 'Pantry', 'Frozen', 'Other'];

/**
 * Infer category from item name when not found in database
 */
export function inferCategory(itemName) {
  const name = itemName.toLowerCase();

  // Category indicators
  const categoryIndicators = {
    Dairy: ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'egg'],
    Meat: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'turkey', 'bacon', 'sausage', 'ham', 'meat'],
    Vegetables: ['lettuce', 'spinach', 'broccoli', 'carrot', 'pepper', 'onion', 'tomato', 'potato', 'celery', 'mushroom', 'vegetable'],
    Fruits: ['apple', 'banana', 'orange', 'berry', 'grape', 'melon', 'peach', 'pear', 'fruit'],
    Bakery: ['bread', 'bagel', 'muffin', 'roll', 'bun', 'cake', 'pie', 'pastry', 'croissant'],
    Beverages: ['juice', 'drink', 'smoothie', 'tea', 'coffee'],
    Frozen: ['frozen', 'ice cream'],
  };

  for (const [category, indicators] of Object.entries(categoryIndicators)) {
    if (indicators.some(indicator => name.includes(indicator))) {
      return category;
    }
  }

  return 'Other';
}

/**
 * Default shelf life by category (fallback)
 */
export const DEFAULT_SHELF_LIFE = {
  Dairy: 7,
  Meat: 3,
  Vegetables: 7,
  Fruits: 5,
  Bakery: 5,
  Beverages: 7,
  Pantry: 365,
  Frozen: 90,
  Other: 7,
};
