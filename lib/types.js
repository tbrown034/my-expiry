export const GroceryItem = {
  id: 'string',
  name: 'string',
  category: 'string',
  purchaseDate: 'Date',
  expiryDate: 'Date',
  daysUntilExpiry: 'number',
  imageUrl: 'string',
  addedManually: 'boolean',
  status: 'fresh' | 'expiring_soon' | 'expired',
  createdAt: 'Date',
  updatedAt: 'Date'
};

export const ExpiryStatus = {
  FRESH: 'fresh',
  EXPIRING_SOON: 'expiring_soon', 
  EXPIRED: 'expired'
};

export const Category = {
  DAIRY: 'dairy',
  MEAT: 'meat',
  VEGETABLES: 'vegetables',
  FRUITS: 'fruits',
  BAKERY: 'bakery',
  FROZEN: 'frozen',
  PANTRY: 'pantry',
  BEVERAGES: 'beverages',
  OTHER: 'other'
};