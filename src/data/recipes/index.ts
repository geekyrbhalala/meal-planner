import { gujaratiRecipes } from './gujarati';
import { northIndianRecipes } from './north-indian';
import { southIndianRecipes } from './south-indian';
import { continentalRecipes } from './continental';
import { indoChineseRecipes } from './indo-chinese';
import { familyFavorites1 } from './family-favorites-1';
import { familyFavorites2 } from './family-favorites-2';
import { familyFavorites3 } from './family-favorites-3';
import type { Recipe } from '../../types/recipe';

export const allRecipes: Recipe[] = [
  ...gujaratiRecipes,
  ...northIndianRecipes,
  ...southIndianRecipes,
  ...continentalRecipes,
  ...indoChineseRecipes,
  ...familyFavorites1,
  ...familyFavorites2,
  ...familyFavorites3,
];

export const getRecipeById = (id: string): Recipe | undefined =>
  allRecipes.find(r => r.id === id);

export const getRecipesByMealType = (mealType: 'breakfast' | 'dinner'): Recipe[] =>
  allRecipes.filter(r => r.mealType === mealType);

export const getRecipesByCuisine = (cuisine: string): Recipe[] =>
  allRecipes.filter(r => r.cuisine === cuisine);

export { gujaratiRecipes, northIndianRecipes, southIndianRecipes, continentalRecipes, indoChineseRecipes, familyFavorites1, familyFavorites2, familyFavorites3 };
