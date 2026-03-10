import type { Recipe, CuisineType } from '../types/recipe';

const BLOCKED_INGREDIENTS = ['mushroom', 'mushrooms', 'button mushroom', 'shiitake'];

export function isMushroomFree(recipe: Recipe): boolean {
  return !recipe.ingredients.some(i =>
    BLOCKED_INGREDIENTS.includes(i.name.toLowerCase())
  );
}

export function isNotUsedThisWeek(recipe: Recipe, usedIds: Set<string>): boolean {
  return !usedIds.has(recipe.id);
}

export function getCuisineCounts(usedRecipes: Recipe[]): Record<CuisineType, number> {
  const counts: Record<CuisineType, number> = {
    'gujarati': 0,
    'north-indian': 0,
    'south-indian': 0,
    'continental': 0,
    'indo-chinese': 0,
  };
  for (const r of usedRecipes) {
    counts[r.cuisine]++;
  }
  return counts;
}

export function isCuisineBalanced(counts: Record<CuisineType, number>): boolean {
  return Object.values(counts).every(c => c <= 3);
}

export function isQuickBreakfast(recipe: Recipe): boolean {
  return recipe.mealType === 'breakfast' && (recipe.prepTime + recipe.cookTime) <= 30;
}

export function applyHardConstraints(recipes: Recipe[], usedIds: Set<string>): Recipe[] {
  return recipes
    .filter(isMushroomFree)
    .filter(r => isNotUsedThisWeek(r, usedIds));
}
