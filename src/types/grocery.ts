import type { GroceryCategory } from './recipe';

export interface GroceryItem {
  ingredientName: string;
  totalQuantity: number;
  unit: string;
  category: GroceryCategory;
  neededFor: string[];
  inPantry: boolean;
  pantryQuantity: number;
  toBuy: number;
  checked: boolean;
}

export const GROCERY_CATEGORY_LABELS: Record<GroceryCategory, string> = {
  'vegetables': 'Vegetables',
  'fruits': 'Fruits',
  'grains-cereals': 'Grains & Cereals',
  'lentils-beans': 'Lentils & Beans',
  'dairy': 'Dairy',
  'spices-masalas': 'Spices & Masalas',
  'oils-ghee': 'Oils & Ghee',
  'nuts-seeds': 'Nuts & Seeds',
  'packaged': 'Packaged Items',
  'other': 'Other',
};

export const GROCERY_CATEGORY_ICONS: Record<GroceryCategory, string> = {
  'vegetables': '🥬',
  'fruits': '🍎',
  'grains-cereals': '🌾',
  'lentils-beans': '🫘',
  'dairy': '🧀',
  'spices-masalas': '🌶',
  'oils-ghee': '🫒',
  'nuts-seeds': '🥜',
  'packaged': '📦',
  'other': '🛒',
};
