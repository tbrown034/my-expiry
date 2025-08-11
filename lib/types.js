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
  FRUITS_VEGETABLES: 'Fruits & Vegetables',
  MEATS_CHEESES: 'Meats & Cheeses',
  DAIRY: 'Dairy',
  BEVERAGES: 'Beverages',
  FROZEN_FOODS: 'Frozen Foods',
  PANTRY: 'Pantry',
  OTHER: 'Other'
};