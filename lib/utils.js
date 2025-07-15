import { ExpiryStatus } from './types';

export const calculateDaysUntilExpiry = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getExpiryStatus = (daysUntilExpiry) => {
  if (daysUntilExpiry < 0) return ExpiryStatus.EXPIRED;
  if (daysUntilExpiry <= 3) return ExpiryStatus.EXPIRING_SOON;
  return ExpiryStatus.FRESH;
};

export const formatExpiryText = (daysUntilExpiry) => {
  if (daysUntilExpiry < 0) {
    const daysExpired = Math.abs(daysUntilExpiry);
    return `Expired ${daysExpired} day${daysExpired === 1 ? '' : 's'} ago`;
  }
  if (daysUntilExpiry === 0) return 'Expires today';
  if (daysUntilExpiry === 1) return 'Expires tomorrow';
  return `Expires in ${daysUntilExpiry} days`;
};

export const getStatusColor = (status) => {
  switch (status) {
    case ExpiryStatus.FRESH:
      return 'bg-green-100 text-green-800 border-green-200';
    case ExpiryStatus.EXPIRING_SOON:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case ExpiryStatus.EXPIRED:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const sortGroceriesByExpiry = (groceries) => {
  return [...groceries].sort((a, b) => {
    const aDays = calculateDaysUntilExpiry(a.expiryDate);
    const bDays = calculateDaysUntilExpiry(b.expiryDate);
    return aDays - bDays;
  });
};

export const getShelfLife = (itemName, category = null) => {
  const name = itemName.toLowerCase().trim();
  
  // Define shelf life mapping based on food categories and specific items
  const shelfLifeMap = {
    // Specific items (override category defaults)
    'bananas': 4,
    'avocados': 3,
    'lettuce': 5,
    'spinach': 3,
    'berries': 3,
    'strawberries': 3,
    'blueberries': 5,
    'grapes': 7,
    'apples': 14,
    'oranges': 14,
    'carrots': 21,
    'potatoes': 30,
    'onions': 30,
    
    // Meat & Fish
    'chicken': 2,
    'beef': 3,
    'pork': 3,
    'fish': 1,
    'ground beef': 1,
    'ground chicken': 1,
    'deli meat': 5,
    'bacon': 7,
    'sausage': 7,
    
    // Dairy
    'milk': 7,
    'yogurt': 14,
    'cheese': 21,
    'butter': 30,
    'eggs': 21,
    'cream': 5,
    
    // Bread & Bakery
    'bread': 4,
    'bagels': 5,
    'pastry': 2,
    'muffins': 3,
    'rolls': 3,
  };

  // Check for specific item first
  for (const [key, days] of Object.entries(shelfLifeMap)) {
    if (name.includes(key)) {
      return days;
    }
  }

  // Fall back to category defaults
  const categoryDefaults = {
    'vegetables': 7,
    'fruits': 5,
    'meat': 2,
    'dairy': 10,
    'bakery': 4,
    'frozen': 90,
    'pantry': 365,
    'beverages': 30,
    'other': 7
  };

  return categoryDefaults[category] || 7; // Default to 7 days
};

export const calculateExpiryDate = (purchaseDate, itemName, category = null) => {
  const purchase = new Date(purchaseDate);
  const shelfLifeDays = getShelfLife(itemName, category);
  
  const expiryDate = new Date(purchase);
  expiryDate.setDate(expiryDate.getDate() + shelfLifeDays);
  
  return expiryDate.toISOString().split('T')[0];
};