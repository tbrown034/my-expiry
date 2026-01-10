/**
 * Local Item Parser
 *
 * Parses user input locally without AI for simple cases.
 * Only calls AI when confidence is low.
 */

import { lookupShelfLife, inferCategory, DEFAULT_SHELF_LIFE, CATEGORIES } from './shelfLifeDatabase';

/**
 * Parse quantity from item string
 * "2 lbs chicken" → { quantity: 2, unit: 'lbs', remaining: 'chicken' }
 * "dozen eggs" → { quantity: 12, unit: 'dozen', remaining: 'eggs' }
 */
function parseQuantity(input) {
  const normalized = input.trim();

  // Common quantity patterns
  const patterns = [
    // "2 lbs chicken", "3 oz beef"
    /^(\d+(?:\.\d+)?)\s*(lbs?|oz|kg|g|gallons?|gal|liters?|l|qt|pint|dozen|doz|pack|pk|ct|count|bunch|head|bag)\s+(.+)$/i,
    // "dozen eggs", "half gallon milk"
    /^(a\s+)?(dozen|doz|half\s+gallon|half\s+dozen)\s+(.+)$/i,
    // "2 chicken breasts"
    /^(\d+)\s+(.+)$/,
  ];

  // Try each pattern
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      let quantity = 1;
      let unit = '';
      let remaining = '';

      if (pattern === patterns[0]) {
        quantity = parseFloat(match[1]);
        unit = match[2].toLowerCase();
        remaining = match[3];
      } else if (pattern === patterns[1]) {
        const qtyWord = match[2].toLowerCase();
        if (qtyWord.includes('dozen')) {
          quantity = qtyWord.includes('half') ? 6 : 12;
        } else if (qtyWord.includes('half gallon')) {
          quantity = 0.5;
          unit = 'gallon';
        }
        remaining = match[3];
      } else {
        quantity = parseInt(match[1]);
        remaining = match[2];
      }

      return { quantity, unit, remaining: remaining.trim() };
    }
  }

  return { quantity: 1, unit: '', remaining: normalized };
}

/**
 * Parse modifier from item string
 * "organic chicken breast" → { modifier: 'organic', remaining: 'chicken breast' }
 * "boneless skinless chicken thighs" → { modifier: 'boneless skinless', remaining: 'chicken thighs' }
 */
function parseModifier(input) {
  const modifierWords = [
    'organic', 'fresh', 'frozen', 'raw', 'cooked', 'leftover',
    'boneless', 'skinless', 'bone-in', 'skin-on',
    'whole', 'sliced', 'diced', 'chopped', 'minced', 'ground',
    'large', 'small', 'medium', 'extra large', 'jumbo',
    'fat-free', 'low-fat', 'reduced fat', 'whole', 'skim', '2%', '1%',
    'grass-fed', 'free-range', 'cage-free', 'pasture-raised',
    'wild-caught', 'farm-raised',
    'ripe', 'unripe', 'green',
  ];

  const words = input.toLowerCase().split(/\s+/);
  const modifiers = [];
  const remaining = [];

  for (const word of words) {
    if (modifierWords.some(m => word.includes(m.toLowerCase()))) {
      modifiers.push(word);
    } else {
      remaining.push(word);
    }
  }

  return {
    modifier: modifiers.join(' '),
    remaining: remaining.join(' ')
  };
}

/**
 * Detect food type from item string
 */
function detectFoodType(input) {
  const lower = input.toLowerCase();

  if (lower.includes('leftover') || lower.includes('cooked') || lower.includes('homemade')) {
    return 'leftover';
  }

  if (lower.includes('rotisserie') || lower.includes('deli') || lower.includes('prepared') || lower.includes('ready-to-eat')) {
    return 'premade';
  }

  return 'store-bought';
}

/**
 * Capitalize first letter of each word
 */
function titleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Parse a single item string into structured data
 *
 * @param {string} input - Raw item string like "2 lbs organic chicken breast"
 * @returns {{ parsed: object, confidence: 'high'|'medium'|'low', needsAI: boolean }}
 */
export function parseItem(input) {
  if (!input || typeof input !== 'string') {
    return { parsed: null, confidence: 'low', needsAI: true };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return { parsed: null, confidence: 'low', needsAI: true };
  }

  // Step 1: Parse quantity
  const { quantity, unit, remaining: afterQuantity } = parseQuantity(trimmed);

  // Step 2: Parse modifiers
  const { modifier, remaining: coreName } = parseModifier(afterQuantity);

  // Step 3: Detect food type
  const foodType = detectFoodType(trimmed);

  // Step 4: Look up shelf life
  const lookup = lookupShelfLife(coreName);

  // Step 5: Build result - preserve user's original name, only correct obvious misspellings
  // We want: "salmon" → "Salmon" (not "Fish"), "potatos" → "Potatoes" (corrected misspelling)
  let displayName = titleCase(coreName);
  if (lookup.found && lookup.matchedKey) {
    // Convert database key to compare
    const cleanKey = lookup.matchedKey.replace(/_raw$|_cooked$/, '').replace(/_/g, ' ');
    const normalizedInput = coreName.toLowerCase().trim();
    const normalizedKey = cleanKey.toLowerCase();

    // Check if this is likely a misspelling (similar to database key)
    // vs a specific variant (completely different word like "salmon" vs "fish")
    const isSimilar = (a, b) => {
      // Simple similarity check: starts with same 3+ chars, or differs by 1-2 chars
      if (a.length < 3 || b.length < 3) return a === b;
      const minLen = Math.min(a.length, b.length);
      const maxLen = Math.max(a.length, b.length);
      // If length difference is small and they share a common prefix
      if (maxLen - minLen <= 2 && a.substring(0, 3) === b.substring(0, 3)) return true;
      // If one contains the other (e.g., "potato" in "potatoes")
      if (a.includes(b) || b.includes(a)) return true;
      return false;
    };

    // Only use database key (corrected spelling) if it's similar to user input
    if (isSimilar(normalizedInput, normalizedKey)) {
      displayName = titleCase(cleanKey);
    }
    // Otherwise preserve user's specific name (e.g., "Salmon" not "Fish")
  }

  const result = {
    name: displayName,
    modifier: modifier ? titleCase(modifier) : '',
    quantity,
    unit,
    foodType,
    category: lookup.found ? lookup.data.category : inferCategory(coreName),
    shelfLifeDays: lookup.found ? lookup.data.days : null,
    source: lookup.found ? lookup.data.source : null,
  };

  // Adjust shelf life for leftovers
  if (foodType === 'leftover' || foodType === 'premade') {
    result.shelfLifeDays = Math.min(result.shelfLifeDays || 4, 4);
    result.source = 'FDA';
  }

  // Determine confidence
  let confidence = lookup.confidence;
  let needsAI = false;

  if (!lookup.found) {
    // If we couldn't find in database, we might need AI
    confidence = 'low';
    needsAI = true;
    // Set default shelf life based on category
    result.shelfLifeDays = DEFAULT_SHELF_LIFE[result.category] || 7;
    result.source = 'USDA Food Safety Guidelines';
  }

  return { parsed: result, confidence, needsAI };
}

/**
 * Parse multiple items from a comma/newline separated string or array
 *
 * @param {string|string[]} input - Raw input
 * @returns {{ items: object[], needsAI: string[], allLocal: boolean }}
 */
export function parseItems(input) {
  // Normalize input to array
  let items;
  if (Array.isArray(input)) {
    items = input;
  } else if (typeof input === 'string') {
    // Split by newline or comma
    items = input.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
  } else {
    return { items: [], needsAI: [], allLocal: true };
  }

  const parsedItems = [];
  const needsAI = [];

  for (const item of items) {
    const { parsed, needsAI: itemNeedsAI } = parseItem(item);

    if (parsed) {
      parsedItems.push(parsed);

      if (itemNeedsAI) {
        needsAI.push(item);
      }
    }
  }

  return {
    items: parsedItems,
    needsAI,
    allLocal: needsAI.length === 0
  };
}

/**
 * Calculate expiry date from shelf life days
 */
export function calculateExpiryDate(shelfLifeDays, purchaseDate = new Date()) {
  const expiry = new Date(purchaseDate);
  expiry.setDate(expiry.getDate() + shelfLifeDays);
  return expiry.toISOString().split('T')[0];
}

/**
 * Process items with full expiry calculation
 *
 * @param {object[]} items - Parsed items from parseItems()
 * @returns {object[]} - Items with expiryDate, daysUntilExpiry, status
 */
export function processItems(items) {
  const today = new Date().toISOString().split('T')[0];

  return items.map(item => {
    const expiryDate = calculateExpiryDate(item.shelfLifeDays);
    const daysUntilExpiry = item.shelfLifeDays;

    return {
      ...item,
      purchaseDate: today,
      expiryDate,
      daysUntilExpiry,
      status: daysUntilExpiry <= 3 ? 'expiring_soon' : 'fresh',
      isPerishable: true,
    };
  });
}
