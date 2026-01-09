/**
 * Food Emoji Mapping System
 *
 * Matches food item names to appropriate emojis using a priority-based algorithm:
 * 1. Abbreviation expansion - "chkn" → "chicken"
 * 2. Compound phrases (checked first) - "orange juice" → 🧃
 * 3. Longer keywords (prevent substring issues) - "pineapple" before "apple"
 * 4. Category-aware fallback - Dairy → 🥛
 * 5. Letter-based fallback - "Turkey Dinner" → "TD"
 * 6. Default fallback - 🍽️
 *
 * See CLAUDE.md for full documentation on edge cases and design decisions.
 */

// Common grocery abbreviations → full words
const abbreviations = {
  chkn: 'chicken',
  chick: 'chicken',
  broc: 'broccoli',
  straw: 'strawberry',
  blueb: 'blueberry',
  raspb: 'raspberry',
  org: 'orange',
  tom: 'tomato',
  toms: 'tomatoes',
  pep: 'pepper',
  peps: 'peppers',
  lem: 'lemon',
  lems: 'lemons',
  pot: 'potato',
  pots: 'potatoes',
  mush: 'mushroom',
  mushr: 'mushroom',
  cukes: 'cucumber',
  cuke: 'cucumber',
  zucc: 'zucchini',
  caul: 'cauliflower',
  lett: 'lettuce',
  spin: 'spinach',
  cel: 'celery',
  carr: 'carrot',
  avo: 'avocado',
  ban: 'banana',
  bans: 'bananas',
  grap: 'grape',
  bf: 'beef',
  grnd: 'ground',
  grd: 'ground',
  turk: 'turkey',
  hamb: 'hamburger',
  saus: 'sausage',
  bkfst: 'breakfast',
  bfast: 'breakfast',
  sal: 'salad',
  sand: 'sandwich',
  sandw: 'sandwich',
  burg: 'burger',
  pizz: 'pizza',
  spag: 'spaghetti',
  mac: 'macaroni',
  yog: 'yogurt',
  crm: 'cream',
  bttr: 'butter',
  mozz: 'mozzarella',
  parm: 'parmesan',
  ched: 'cheddar',
  OJ: 'orange juice',
  PB: 'peanut butter',
  PBJ: 'peanut butter',
  pb: 'peanut butter',
  oj: 'orange juice',
};

// PRIORITY 1: Compound phrases (checked first, before single words)
// These prevent incorrect matches like "orange juice" → 🍊
const compoundPhrases = {
  'orange juice': '🧃',
  'apple juice': '🧃',
  'grape juice': '🧃',
  'cranberry juice': '🧃',
  'ice cream': '🍦',
  'peanut butter': '🥜',
  'almond butter': '🥜',
  'cream cheese': '🧀',
  'cottage cheese': '🧀',
  'sour cream': '🥛',
  'whipped cream': '🥛',
  'hot dog': '🌭',
  'french fries': '🍟',
  'fried rice': '🍚',
  'fried chicken': '🍗',
  'grilled cheese': '🧀',
  'mac and cheese': '🧀',
  'chicken salad': '🥗',
  'tuna salad': '🥗',
  'egg salad': '🥗',
  'fruit salad': '🥗',
  'potato salad': '🥗',
  'green beans': '🥬',
  'baked beans': '🥫',
  'string cheese': '🧀',
  'greek yogurt': '🥛',
  'ground beef': '🥩',
  'ground turkey': '🍗',
  'lunch meat': '🥩',
  'deli meat': '🥩',
};

// PRIORITY 2: Single keywords (sorted by length descending at runtime)
const foodKeywords = {
  // Fruits (longer words first in object, but we sort at runtime)
  strawberry: '🍓',
  watermelon: '🍉',
  blueberry: '🫐',
  raspberry: '🫐',
  blackberry: '🫐',
  pineapple: '🍍',
  grapefruit: '🍊',
  cantaloupe: '🍈',
  honeydew: '🍈',
  tangerine: '🍊',
  clementine: '🍊',
  pomegranate: '🍎',
  passionfruit: '🍎',
  dragonfruit: '🍎',
  coconut: '🥥',
  avocado: '🥑',
  banana: '🍌',
  orange: '🍊',
  tomato: '🍅',
  cherry: '🍒',
  grapes: '🍇',
  grape: '🍇',
  lemon: '🍋',
  mango: '🥭',
  melon: '🍈',
  peach: '🍑',
  apple: '🍎',
  lime: '🍋',
  pear: '🍐',
  kiwi: '🥝',
  fig: '🍇',

  // Vegetables
  asparagus: '🥬',
  artichoke: '🥬',
  zucchini: '🥒',
  cucumber: '🥒',
  broccoli: '🥦',
  cauliflower: '🥦',
  eggplant: '🍆',
  mushroom: '🍄',
  spinach: '🥬',
  cabbage: '🥬',
  lettuce: '🥬',
  celery: '🥬',
  carrot: '🥕',
  potato: '🥔',
  pepper: '🫑',
  onion: '🧅',
  garlic: '🧄',
  corn: '🌽',
  peas: '🥬',
  kale: '🥬',

  // Meat & Protein
  prosciutto: '🥓',
  pepperoni: '🍕',
  sausage: '🌭',
  chicken: '🍗',
  turkey: '🍗',
  salami: '🥓',
  bacon: '🥓',
  franks: '🌭',
  hotdogs: '🌭',
  steak: '🥩',
  roast: '🥩',
  pork: '🥩',
  beef: '🥩',
  lamb: '🥩',
  veal: '🥩',
  tofu: '🧈',
  tempeh: '🧈',
  meat: '🥩',
  deli: '🥩',
  ham: '🍖',
  ribs: '🍖',

  // Seafood
  lobster: '🦞',
  shrimp: '🦐',
  prawns: '🦐',
  salmon: '🍣',
  tuna: '🐟',
  fish: '🐟',
  crab: '🦀',
  cod: '🐟',

  // Eggs
  eggs: '🥚',
  egg: '🥚',
  omelet: '🥚',
  omelette: '🥚',

  // Dairy
  parmesan: '🧀',
  cheddar: '🧀',
  mozzarella: '🧀',
  cheese: '🧀',
  yogurt: '🥛',
  butter: '🧈',
  cream: '🥛',
  milk: '🥛',

  // Bread & Bakery
  croissant: '🥐',
  baguette: '🥖',
  pancakes: '🥞',
  pancake: '🥞',
  waffles: '🧇',
  waffle: '🧇',
  pretzel: '🥨',
  muffin: '🧁',
  cookie: '🍪',
  bagel: '🥯',
  bread: '🍞',
  toast: '🍞',
  donut: '🍩',
  cake: '🎂',
  pie: '🥧',
  roll: '🍞',

  // Prepared Foods
  quesadilla: '🌮',
  enchilada: '🌯',
  burrito: '🌯',
  lasagna: '🍝',
  spaghetti: '🍝',
  sandwich: '🥪',
  hamburger: '🍔',
  cheeseburger: '🍔',
  pizza: '🍕',
  burger: '🍔',
  taco: '🌮',
  wrap: '🌯',
  sushi: '🍣',
  ramen: '🍜',
  noodle: '🍜',
  pasta: '🍝',
  soup: '🍲',
  stew: '🍲',
  curry: '🍛',
  rice: '🍚',
  fries: '🍟',
  salad: '🥗',
  sub: '🥪',

  // Leftovers & Prepared
  leftover: '🍱',
  leftovers: '🍱',
  lunchable: '🍱',
  lunchables: '🍱',
  dinner: '🍽️',
  meal: '🍽️',
  prep: '🍱',

  // Drinks
  smoothie: '🥤',
  lemonade: '🍋',
  coffee: '☕',
  espresso: '☕',
  juice: '🧃',
  soda: '🥤',
  cola: '🥤',
  beer: '🍺',
  wine: '🍷',
  tea: '🍵',

  // Snacks & Misc
  chocolate: '🍫',
  popcorn: '🍿',
  pretzel: '🥨',
  candy: '🍬',
  chips: '🥔',
  nuts: '🥜',
  hummus: '🥙',
  guacamole: '🥑',
  salsa: '🥫',
  dip: '🥣',
  honey: '🍯',
  sauce: '🥫',
  jam: '🍯',
  jelly: '🍯',

  // Frozen items (popsicle, etc. - "frozen" keyword handled separately with lower priority)
  popsicle: '🍦',
};

// LOW PRIORITY: Keywords checked last (so "frozen chicken" → 🍗 not 🧊)
const lowPriorityKeywords = {
  frozen: '🧊',
  ice: '🧊',
  fresh: '🥬',
  organic: '🥬',
};

const sortedLowPriority = Object.entries(lowPriorityKeywords)
  .sort((a, b) => b[0].length - a[0].length);

// PRIORITY 4: Category fallback emojis
const categoryEmojis = {
  Dairy: '🥛',
  Meat: '🥩',
  Vegetables: '🥬',
  Fruits: '🍎',
  Bakery: '🍞',
  Frozen: '🧊',
  Pantry: '🥫',
  Beverages: '🧃',
  Seafood: '🐟',
  Deli: '🥪',
  Other: '🍽️',
};

// Pre-sort keywords by length (descending) for accurate matching
// This ensures "pineapple" is checked before "apple"
const sortedKeywords = Object.entries(foodKeywords)
  .sort((a, b) => b[0].length - a[0].length);

const sortedCompounds = Object.entries(compoundPhrases)
  .sort((a, b) => b[0].length - a[0].length);

/**
 * Expand abbreviations in a name string
 * @param {string} name - The item name
 * @returns {string} Name with abbreviations expanded
 */
function expandAbbreviations(name) {
  let expanded = name.toLowerCase();

  // Sort abbreviations by length (longest first) to prevent partial matches
  const sortedAbbrevs = Object.entries(abbreviations)
    .sort((a, b) => b[0].length - a[0].length);

  for (const [abbrev, full] of sortedAbbrevs) {
    // Match whole words only (with word boundaries)
    const regex = new RegExp(`\\b${abbrev}\\b`, 'gi');
    expanded = expanded.replace(regex, full);
  }

  return expanded;
}

/**
 * Generate letter-based fallback (first letters of each word)
 * @param {string} name - The item name
 * @returns {string} Letters like "TD" for "Turkey Dinner"
 */
function getLetterFallback(name) {
  const words = name.trim().split(/\s+/);
  if (words.length < 2) {
    // Single word: return first 2 letters capitalized
    return name.substring(0, 2).toUpperCase();
  }
  // Multiple words: return first letter of each (up to 3)
  return words
    .slice(0, 3)
    .map(w => w.charAt(0).toUpperCase())
    .join('');
}

/**
 * Get an emoji for a food item based on its name and category
 *
 * Algorithm:
 * 1. Expand abbreviations (chkn → chicken)
 * 2. Check compound phrases first (longest first)
 * 3. Check single keywords (longest first)
 * 4. Check low-priority keywords (frozen, ice)
 * 5. Fall back to category emoji
 * 6. Letter-based fallback (TD for Turkey Dinner)
 *
 * @param {string} name - The item name (e.g., "Dominos Pizza")
 * @param {string} category - The item category (e.g., "Other")
 * @returns {string} An emoji representing the food
 */
export function getFoodEmoji(name, category) {
  if (!name) return '🍽️';

  // 1. Expand abbreviations first
  const expandedName = expandAbbreviations(name);

  // 2. Check compound phrases first (prevents "orange juice" → 🍊)
  for (const [phrase, emoji] of sortedCompounds) {
    if (expandedName.includes(phrase)) {
      return emoji;
    }
  }

  // 3. Check single keywords (longest first prevents "pineapple" → 🍎)
  for (const [keyword, emoji] of sortedKeywords) {
    if (expandedName.includes(keyword)) {
      return emoji;
    }
  }

  // 4. Check low-priority keywords (frozen, ice - checked after food keywords)
  for (const [keyword, emoji] of sortedLowPriority) {
    if (expandedName.includes(keyword)) {
      return emoji;
    }
  }

  // 5. Fall back to category emoji
  if (category && categoryEmojis[category]) {
    return categoryEmojis[category];
  }

  // 6. Letter-based fallback (e.g., "TD" for Turkey Dinner)
  return getLetterFallback(name);
}

/**
 * Get a background color class based on category
 * Used for visual grouping in the fridge view
 *
 * @param {string} category - The item category
 * @returns {string} Tailwind CSS class for background color
 */
export function getCategoryBgColor(category) {
  const colors = {
    Dairy: 'bg-sky-50',
    Meat: 'bg-rose-50',
    Vegetables: 'bg-green-50',
    Fruits: 'bg-orange-50',
    Bakery: 'bg-amber-50',
    Frozen: 'bg-cyan-50',
    Pantry: 'bg-stone-50',
    Beverages: 'bg-purple-50',
    Seafood: 'bg-blue-50',
    Deli: 'bg-pink-50',
    Other: 'bg-slate-50',
  };
  return colors[category] || 'bg-slate-50';
}

/**
 * Debug helper: Show what emoji would be matched for a name
 * Useful for testing edge cases
 *
 * @param {string} name - The item name to test
 * @param {string} category - Optional category
 * @returns {object} Debug info about the match
 */
export function debugEmojiMatch(name, category = null) {
  const expandedName = expandAbbreviations(name);
  const wasExpanded = expandedName !== name.toLowerCase();

  // Check compounds
  for (const [phrase, emoji] of sortedCompounds) {
    if (expandedName.includes(phrase)) {
      return { emoji, matchType: 'compound', matched: phrase, expanded: wasExpanded ? expandedName : null };
    }
  }

  // Check keywords
  for (const [keyword, emoji] of sortedKeywords) {
    if (expandedName.includes(keyword)) {
      return { emoji, matchType: 'keyword', matched: keyword, expanded: wasExpanded ? expandedName : null };
    }
  }

  // Check low-priority keywords
  for (const [keyword, emoji] of sortedLowPriority) {
    if (expandedName.includes(keyword)) {
      return { emoji, matchType: 'lowPriority', matched: keyword, expanded: wasExpanded ? expandedName : null };
    }
  }

  // Category fallback
  if (category && categoryEmojis[category]) {
    return { emoji: categoryEmojis[category], matchType: 'category', matched: category };
  }

  // Letter fallback
  const letterFallback = getLetterFallback(name);
  return { emoji: letterFallback, matchType: 'letters', matched: name };
}
