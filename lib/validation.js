/**
 * Centralized validation utilities for the Food Xpiry app
 * Handles date validation, input limits, and business rule enforcement
 */

// ==================== CONSTANTS ====================
export const LIMITS = {
  MAX_ITEM_NAME_LENGTH: 100,
  MAX_MODIFIER_LENGTH: 100,
  MAX_SHELF_LIFE_DAYS: 3650, // 10 years
  MIN_SHELF_LIFE_DAYS: 1,
  MAX_QUANTITY: 99,
  MIN_QUANTITY: 1,
  MAX_ITEMS_PER_BATCH: 50,
  MAX_PURCHASE_DATE_FUTURE_DAYS: 7, // Allow up to 7 days in future for pre-shopping
  MAX_EXPIRY_YEARS_AHEAD: 10,
  STORAGE_WARNING_THRESHOLD: 500, // Warn at 500 items
  STORAGE_MAX_ITEMS: 1000, // Hard limit
};

// ==================== DATE VALIDATION ====================

/**
 * Validate a date string is a valid ISO date
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} - Whether the date is valid
 */
export function isValidDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Validate purchase date is not too far in the future
 * @param {string} purchaseDateStr - Purchase date string
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePurchaseDate(purchaseDateStr) {
  if (!isValidDate(purchaseDateStr)) {
    return { valid: false, error: 'Invalid purchase date format' };
  }

  const purchaseDate = new Date(purchaseDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxFutureDate = new Date(today);
  maxFutureDate.setDate(maxFutureDate.getDate() + LIMITS.MAX_PURCHASE_DATE_FUTURE_DAYS);

  if (purchaseDate > maxFutureDate) {
    return {
      valid: false,
      error: `Purchase date cannot be more than ${LIMITS.MAX_PURCHASE_DATE_FUTURE_DAYS} days in the future`
    };
  }

  return { valid: true };
}

/**
 * Validate expiry date is after purchase date and within reasonable range
 * @param {string} expiryDateStr - Expiry date string
 * @param {string} purchaseDateStr - Purchase date string
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateExpiryDate(expiryDateStr, purchaseDateStr) {
  if (!isValidDate(expiryDateStr)) {
    return { valid: false, error: 'Invalid expiry date format' };
  }

  if (!isValidDate(purchaseDateStr)) {
    return { valid: false, error: 'Invalid purchase date format' };
  }

  const expiryDate = new Date(expiryDateStr);
  const purchaseDate = new Date(purchaseDateStr);

  // Expiry must be on or after purchase date
  if (expiryDate < purchaseDate) {
    return { valid: false, error: 'Expiry date must be on or after purchase date' };
  }

  // Check max expiry date (10 years from now)
  const maxExpiryDate = new Date();
  maxExpiryDate.setFullYear(maxExpiryDate.getFullYear() + LIMITS.MAX_EXPIRY_YEARS_AHEAD);

  if (expiryDate > maxExpiryDate) {
    return {
      valid: false,
      error: `Expiry date cannot be more than ${LIMITS.MAX_EXPIRY_YEARS_AHEAD} years in the future`
    };
  }

  return { valid: true };
}

/**
 * Validate all date-related fields for a grocery item
 * @param {Object} item - Item with purchaseDate and expiryDate
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateItemDates(item) {
  const errors = [];

  const purchaseValidation = validatePurchaseDate(item.purchaseDate);
  if (!purchaseValidation.valid) {
    errors.push(purchaseValidation.error);
  }

  const expiryValidation = validateExpiryDate(item.expiryDate, item.purchaseDate);
  if (!expiryValidation.valid) {
    errors.push(expiryValidation.error);
  }

  return { valid: errors.length === 0, errors };
}

// ==================== SHELF LIFE VALIDATION ====================

/**
 * Validate and clamp shelf life days to acceptable range
 * @param {number} days - Shelf life days
 * @returns {number} - Clamped shelf life days
 */
export function clampShelfLifeDays(days) {
  if (typeof days !== 'number' || isNaN(days)) {
    return 7; // Default to 7 days
  }
  return Math.max(LIMITS.MIN_SHELF_LIFE_DAYS, Math.min(LIMITS.MAX_SHELF_LIFE_DAYS, Math.round(days)));
}

/**
 * Validate shelf life days
 * @param {number} days - Shelf life days to validate
 * @returns {{ valid: boolean, error?: string, clamped: number }}
 */
export function validateShelfLifeDays(days) {
  const clamped = clampShelfLifeDays(days);

  if (typeof days !== 'number' || isNaN(days)) {
    return { valid: false, error: 'Invalid shelf life value', clamped };
  }

  if (days < LIMITS.MIN_SHELF_LIFE_DAYS) {
    return { valid: false, error: 'Shelf life must be at least 1 day', clamped };
  }

  if (days > LIMITS.MAX_SHELF_LIFE_DAYS) {
    return {
      valid: false,
      error: `Shelf life capped at ${LIMITS.MAX_SHELF_LIFE_DAYS} days (${Math.round(LIMITS.MAX_SHELF_LIFE_DAYS / 365)} years)`,
      clamped
    };
  }

  return { valid: true, clamped };
}

// ==================== INPUT VALIDATION ====================

/**
 * Validate and sanitize item name
 * @param {string} name - Item name
 * @returns {{ valid: boolean, sanitized: string, error?: string }}
 */
export function validateItemName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, sanitized: '', error: 'Item name is required' };
  }

  const sanitized = name.trim().substring(0, LIMITS.MAX_ITEM_NAME_LENGTH);

  if (sanitized.length === 0) {
    return { valid: false, sanitized: '', error: 'Item name cannot be empty' };
  }

  // Check for suspicious patterns (basic XSS prevention)
  if (/<script|javascript:|on\w+=/i.test(sanitized)) {
    return { valid: false, sanitized: '', error: 'Invalid characters in item name' };
  }

  return { valid: true, sanitized };
}

/**
 * Validate quantity
 * @param {number} quantity - Quantity to validate
 * @returns {{ valid: boolean, clamped: number, error?: string }}
 */
export function validateQuantity(quantity) {
  const num = parseInt(quantity, 10);

  if (isNaN(num)) {
    return { valid: false, clamped: 1, error: 'Invalid quantity' };
  }

  const clamped = Math.max(LIMITS.MIN_QUANTITY, Math.min(LIMITS.MAX_QUANTITY, num));

  return { valid: true, clamped };
}

// ==================== EXPIRY STATUS ====================

/**
 * Safe getExpiryStatus that handles invalid dates
 * @param {string} expiryDateStr - Expiry date string
 * @returns {string} - Status: 'expired', 'expiring_soon', 'fresh', or 'unknown'
 */
export function getExpiryStatusSafe(expiryDateStr) {
  if (!isValidDate(expiryDateStr)) {
    console.warn(`Invalid expiry date: ${expiryDateStr}`);
    return 'unknown';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (isNaN(daysUntilExpiry)) {
    return 'unknown';
  }

  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 3) return 'expiring_soon';
  return 'fresh';
}

/**
 * Safe calculation of days until expiry
 * @param {string} expiryDateStr - Expiry date string
 * @returns {number|null} - Days until expiry or null if invalid
 */
export function getDaysUntilExpirySafe(expiryDateStr) {
  if (!isValidDate(expiryDateStr)) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const days = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  return isNaN(days) ? null : days;
}

// ==================== STORAGE VALIDATION ====================

/**
 * Check localStorage availability and quota
 * @returns {{ available: boolean, reason?: string, itemCount?: number, nearLimit?: boolean }}
 */
export function checkStorageStatus() {
  if (typeof window === 'undefined') {
    return { available: false, reason: 'Server-side rendering' };
  }

  try {
    // Test write capability
    const testKey = '__storage_test__' + Date.now();
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);

    // Check current item count
    const stored = localStorage.getItem('expiry_groceries');
    const groceries = stored ? JSON.parse(stored) : [];
    const itemCount = groceries.length;

    return {
      available: true,
      itemCount,
      nearLimit: itemCount >= LIMITS.STORAGE_WARNING_THRESHOLD,
      atLimit: itemCount >= LIMITS.STORAGE_MAX_ITEMS,
    };
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      return { available: false, reason: 'Storage quota exceeded' };
    }
    return { available: false, reason: 'Storage unavailable' };
  }
}

// ==================== DUPLICATE DETECTION ====================

/**
 * Find potential duplicate items
 * @param {Array} existingGroceries - Current grocery list
 * @param {Object} newItem - Item to check
 * @returns {Array} - Array of potential duplicates
 */
export function findDuplicates(existingGroceries, newItem) {
  if (!existingGroceries || !Array.isArray(existingGroceries)) return [];
  if (!newItem || !newItem.name) return [];

  const newNameLower = newItem.name.toLowerCase().trim();

  return existingGroceries.filter(g => {
    // Skip eaten or expired items
    if (g.eaten || g.markedExpired) return false;

    const existingNameLower = (g.name || '').toLowerCase().trim();

    // Exact match
    if (existingNameLower === newNameLower) return true;

    // Fuzzy match - one contains the other
    if (existingNameLower.includes(newNameLower) || newNameLower.includes(existingNameLower)) {
      // Only if they share the same category
      if (g.category === newItem.category) return true;
    }

    return false;
  });
}

/**
 * Check if adding items would exceed storage limit
 * @param {number} currentCount - Current item count
 * @param {number} newCount - Number of new items to add
 * @returns {{ allowed: boolean, warning?: string }}
 */
export function checkAddLimit(currentCount, newCount) {
  const totalAfterAdd = currentCount + newCount;

  if (totalAfterAdd > LIMITS.STORAGE_MAX_ITEMS) {
    return {
      allowed: false,
      warning: `Cannot add ${newCount} items. Maximum ${LIMITS.STORAGE_MAX_ITEMS} items allowed. You have ${currentCount} items.`,
    };
  }

  if (totalAfterAdd >= LIMITS.STORAGE_WARNING_THRESHOLD) {
    return {
      allowed: true,
      warning: `You have ${currentCount} items. Consider removing old items to keep your fridge organized.`,
    };
  }

  return { allowed: true };
}

// ==================== RATE LIMITING ====================

/**
 * In-memory rate limiter for API routes
 */
const rateLimitStore = new Map();

/**
 * Check rate limit for a user/action
 * @param {string} key - Unique key (e.g., 'api:parse-items:anonymous')
 * @param {Object} limits - { perMinute, perHour, perDay }
 * @returns {{ allowed: boolean, retryAfter?: number, error?: string }}
 */
export function checkRateLimit(key, limits = { perMinute: 30, perHour: 200, perDay: 1000 }) {
  const now = Date.now();

  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, {
      minute: { count: 0, reset: now + 60000 },
      hour: { count: 0, reset: now + 3600000 },
      day: { count: 0, reset: now + 86400000 },
    });
  }

  const store = rateLimitStore.get(key);

  // Reset windows if expired
  if (now > store.minute.reset) {
    store.minute = { count: 0, reset: now + 60000 };
  }
  if (now > store.hour.reset) {
    store.hour = { count: 0, reset: now + 3600000 };
  }
  if (now > store.day.reset) {
    store.day = { count: 0, reset: now + 86400000 };
  }

  // Check limits
  if (store.minute.count >= limits.perMinute) {
    return {
      allowed: false,
      retryAfter: Math.ceil((store.minute.reset - now) / 1000),
      error: 'Too many requests. Please wait a minute before trying again.'
    };
  }
  if (store.hour.count >= limits.perHour) {
    return {
      allowed: false,
      retryAfter: Math.ceil((store.hour.reset - now) / 1000),
      error: 'Hourly limit reached. Please try again later.'
    };
  }
  if (store.day.count >= limits.perDay) {
    return {
      allowed: false,
      retryAfter: Math.ceil((store.day.reset - now) / 1000),
      error: 'Daily limit reached. Please try again tomorrow.'
    };
  }

  // Increment counters
  store.minute.count++;
  store.hour.count++;
  store.day.count++;

  return { allowed: true };
}

// ==================== FOOD SAFETY VALIDATION ====================

/**
 * Validate shelf life against FDA guidelines for food safety
 * @param {string} itemName - Item name
 * @param {string} category - Category
 * @param {number} shelfLifeDays - Proposed shelf life
 * @returns {{ valid: boolean, warning?: string, maxSafeDays?: number }}
 */
export function validateFoodSafety(itemName, category, shelfLifeDays) {
  const nameLower = (itemName || '').toLowerCase();

  // FDA max storage guidelines
  const safetyLimits = {
    rawPoultry: { max: 2, keywords: ['chicken', 'turkey', 'duck', 'poultry'] },
    rawGroundMeat: { max: 2, keywords: ['ground beef', 'ground pork', 'ground meat', 'mince'] },
    rawFish: { max: 2, keywords: ['fish', 'salmon', 'tuna', 'shrimp', 'seafood'] },
    deli: { max: 5, keywords: ['deli', 'lunch meat', 'cold cut'] },
    leftovers: { max: 4, keywords: ['leftover', 'cooked'] },
  };

  for (const [, rule] of Object.entries(safetyLimits)) {
    const matches = rule.keywords.some(kw => nameLower.includes(kw));
    if (matches && shelfLifeDays > rule.max) {
      return {
        valid: false,
        warning: `FDA recommends using ${itemName} within ${rule.max} days for food safety.`,
        maxSafeDays: rule.max,
      };
    }
  }

  return { valid: true };
}
