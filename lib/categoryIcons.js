import { Category } from './types';
import {
  BeakerIcon,
  CakeIcon,
  CubeIcon,
  ShoppingBagIcon,
  SparklesIcon,
  SunIcon,
  FireIcon,
  CloudIcon,
} from '@heroicons/react/24/outline';

// Category icons mapping - centralized for consistency
export const categoryIcons = {
  [Category.DAIRY]: BeakerIcon,
  [Category.MEAT]: FireIcon,
  [Category.VEGETABLES]: SparklesIcon,
  [Category.FRUITS]: SunIcon,
  [Category.BAKERY]: CakeIcon,
  [Category.FROZEN]: CloudIcon,
  [Category.PANTRY]: ShoppingBagIcon,
  [Category.BEVERAGES]: BeakerIcon,
  [Category.OTHER]: CubeIcon,
};

// Default icon for unknown categories
export const DefaultCategoryIcon = CubeIcon;

// Helper function to get icon for a category
export function getCategoryIcon(category) {
  return categoryIcons[category] || DefaultCategoryIcon;
}
