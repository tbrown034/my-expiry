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

export const sortGroceries = (groceries, sortBy) => {
  const sortedGroceries = [...groceries];
  
  switch (sortBy) {
    case 'name':
      return sortedGroceries.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'category':
      return sortedGroceries.sort((a, b) => {
        const categoryCompare = a.category.localeCompare(b.category);
        return categoryCompare !== 0 ? categoryCompare : a.name.localeCompare(b.name);
      });
    
    case 'purchase-date':
      return sortedGroceries.sort((a, b) => {
        const aDate = a.purchaseDate ? new Date(a.purchaseDate) : new Date(0);
        const bDate = b.purchaseDate ? new Date(b.purchaseDate) : new Date(0);
        return bDate - aDate; // Most recent first
      });
    
    case 'expiry':
    default:
      return sortGroceriesByExpiry(sortedGroceries);
  }
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
    
    // Beverages
    'soda': 365,
    'beer': 120,
    'wine': 365,
    'vodka': 730,
    'whiskey': 730,
    'juice': 7,
    'water': 365,
    'sports drink': 365,
    'energy drink': 365,
    'diet soda': 365,
    'mountain dew': 365,
    'mule': 120,
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
    'pantry': 365,
    'beverages': 365,
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

export const getCategoryIcon = (category) => {
  const iconMap = {
    'vegetables': '🥕',
    'fruits': '🍎',
    'meat': '🥩',
    'dairy': '🥛',
    'pantry': '🥫',
    'other': '🛒'
  };
  
  return iconMap[category?.toLowerCase()] || iconMap['other'];
};

export const getCategoryColor = (category) => {
  const colorMap = {
    'vegetables': '#10b981', // green
    'fruits': '#f59e0b',     // orange
    'meat': '#ef4444',       // red
    'dairy': '#3b82f6',      // blue
    'pantry': '#84cc16',     // lime
    'other': '#6b7280'       // gray
  };
  
  return colorMap[category?.toLowerCase()] || colorMap['other'];
};

export const getCategoryColorClass = (category) => {
  const colorClassMap = {
    'vegetables': 'bg-green-500',
    'fruits': 'bg-orange-500',
    'meat': 'bg-red-500',
    'dairy': 'bg-blue-500',
    'pantry': 'bg-lime-500',
    'beverages': 'bg-purple-500',
    'leftovers': 'bg-yellow-500',
    'other': 'bg-gray-500'
  };
  
  return colorClassMap[category?.toLowerCase()] || colorClassMap['other'];
};

export const calculateHoursUntilExpiry = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - now;
  return Math.floor(diffTime / (1000 * 60 * 60)); // Convert to hours
};

export const formatCountdown = (hoursUntilExpiry) => {
  if (hoursUntilExpiry < 0) {
    const hoursExpired = Math.abs(hoursUntilExpiry);
    if (hoursExpired < 24) {
      return `${hoursExpired}h ago`;
    } else {
      const daysExpired = Math.floor(hoursExpired / 24);
      return `${daysExpired}d ago`;
    }
  }
  
  if (hoursUntilExpiry === 0) return 'Expires now!';
  if (hoursUntilExpiry < 24) return `${hoursUntilExpiry}h left`;
  
  const days = Math.floor(hoursUntilExpiry / 24);
  const hours = hoursUntilExpiry % 24;
  
  if (days === 1 && hours === 0) return 'Tomorrow';
  if (days === 1) return `1d ${hours}h`;
  if (hours === 0) return `${days}d`;
  
  return `${days}d ${hours}h`;
};

export const formatGroceryName = (name) => {
  if (!name || typeof name !== 'string') return 'Unknown Item?';
  
  const cleaned = name.trim();
  if (!cleaned) return 'Unknown Item?';
  
  const words = cleaned.toLowerCase().split(/\s+/);
  const formatted = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
  
  const foodKeywords = [
    'fruit', 'vegetable', 'meat', 'dairy', 'bread', 'milk', 'cheese', 'apple', 'banana',
    'chicken', 'beef', 'pork', 'fish', 'lettuce', 'tomato', 'potato', 'onion', 'carrot',
    'broccoli', 'spinach', 'yogurt', 'butter', 'egg', 'rice', 'pasta', 'beans', 'corn',
    'pizza', 'stew', 'soup', 'sandwich', 'salad', 'leftover', 'juice', 'water', 'soda',
    'beer', 'wine', 'coffee', 'tea', 'sugar', 'flour', 'salt', 'pepper', 'oil', 'vinegar'
  ];
  
  const isLikelyFood = foodKeywords.some(keyword => 
    cleaned.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (!isLikelyFood && cleaned.length < 3) {
    return formatted + '?';
  }
  
  if (!isLikelyFood && !/^[a-zA-Z\s'-]+$/.test(cleaned)) {
    return formatted + '?';
  }
  
  return formatted;
};

export const formatCategoryName = (category) => {
  if (!category || typeof category !== 'string') return 'Other';
  
  const validCategories = [
    'vegetables', 'fruits', 'meat', 'dairy', 'pantry', 
    'beverages', 'leftovers', 'bakery', 'frozen', 'other'
  ];
  
  const cleaned = category.trim().toLowerCase();
  if (validCategories.includes(cleaned)) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  return 'Other';
};