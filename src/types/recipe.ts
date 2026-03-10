export type CuisineType = 'gujarati' | 'north-indian' | 'south-indian' | 'continental' | 'indo-chinese';
export type MealType = 'breakfast' | 'dinner';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type GroceryCategory =
  | 'vegetables'
  | 'fruits'
  | 'grains-cereals'
  | 'lentils-beans'
  | 'dairy'
  | 'spices-masalas'
  | 'oils-ghee'
  | 'nuts-seeds'
  | 'packaged'
  | 'other';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category: GroceryCategory;
  optional?: boolean;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Recipe {
  id: string;
  name: string;
  nameGujarati?: string;
  cuisine: CuisineType;
  mealType: MealType;
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: DifficultyLevel;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionInfo;
  tags: string[];
  isDefault: boolean;
  proteinBoostTip?: string;
  flourAlternatives?: string[];
}

export const CUISINE_LABELS: Record<CuisineType, string> = {
  'gujarati': 'Gujarati',
  'north-indian': 'North Indian',
  'south-indian': 'South Indian',
  'continental': 'Continental',
  'indo-chinese': 'Indo-Chinese',
};

export const CUISINE_COLORS: Record<CuisineType, string> = {
  'gujarati': '#f97316',
  'north-indian': '#ef4444',
  'south-indian': '#eab308',
  'continental': '#3b82f6',
  'indo-chinese': '#8b5cf6',
};
