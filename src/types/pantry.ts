import type { GroceryCategory } from './recipe';

export interface PantryItem {
  ingredientName: string;
  quantity: number;
  unit: string;
  category: GroceryCategory;
  alwaysInStock: boolean;
}

export const DEFAULT_ALWAYS_IN_STOCK: PantryItem[] = [
  { ingredientName: 'salt', quantity: 0, unit: 'g', category: 'spices-masalas', alwaysInStock: true },
  { ingredientName: 'turmeric', quantity: 0, unit: 'g', category: 'spices-masalas', alwaysInStock: true },
  { ingredientName: 'red chili powder', quantity: 0, unit: 'g', category: 'spices-masalas', alwaysInStock: true },
  { ingredientName: 'cumin seeds', quantity: 0, unit: 'g', category: 'spices-masalas', alwaysInStock: true },
  { ingredientName: 'mustard seeds', quantity: 0, unit: 'g', category: 'spices-masalas', alwaysInStock: true },
  { ingredientName: 'coriander powder', quantity: 0, unit: 'g', category: 'spices-masalas', alwaysInStock: true },
  { ingredientName: 'garam masala', quantity: 0, unit: 'g', category: 'spices-masalas', alwaysInStock: true },
  { ingredientName: 'oil', quantity: 0, unit: 'ml', category: 'oils-ghee', alwaysInStock: true },
  { ingredientName: 'ghee', quantity: 0, unit: 'ml', category: 'oils-ghee', alwaysInStock: true },
  { ingredientName: 'sugar', quantity: 0, unit: 'g', category: 'other', alwaysInStock: true },
  { ingredientName: 'hing', quantity: 0, unit: 'g', category: 'spices-masalas', alwaysInStock: true },
  { ingredientName: 'curry leaves', quantity: 0, unit: 'pieces', category: 'vegetables', alwaysInStock: true },
];
