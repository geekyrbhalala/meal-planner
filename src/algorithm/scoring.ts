import type { Recipe } from '../types/recipe';
import { getCuisineCounts } from './constraints';

interface ScoringContext {
  usedDinners: Recipe[];
  previousDayRecipe: Recipe | null;
  dayIndex: number; // 0=Sunday
}

export function scoreRecipe(recipe: Recipe, context: ScoringContext): number {
  let score = 0;

  // Cuisine balance: prefer underrepresented cuisines
  const cuisineCounts = getCuisineCounts(context.usedDinners);
  const totalUsed = context.usedDinners.length;
  const idealPerCuisine = totalUsed / 5;
  const currentCount = cuisineCounts[recipe.cuisine] || 0;

  if (currentCount < idealPerCuisine) {
    score += 10;
  } else if (currentCount === 0) {
    score += 15;
  } else if (currentCount >= 2) {
    score -= 5;
  }

  // Protein score: reward high-protein recipes
  if (recipe.nutrition.protein >= 25) {
    score += 10;
  } else if (recipe.nutrition.protein >= 15) {
    score += 5;
  }

  // Variety: different main ingredient from previous day
  if (context.previousDayRecipe) {
    const prevMainIngredient = context.previousDayRecipe.ingredients[0]?.name.toLowerCase() ?? '';
    const thisMainIngredient = recipe.ingredients[0]?.name.toLowerCase() ?? '';
    if (prevMainIngredient !== thisMainIngredient) {
      score += 3;
    } else {
      score -= 3;
    }

    // Different cuisine from previous day
    if (recipe.cuisine !== context.previousDayRecipe.cuisine) {
      score += 4;
    }
  }

  // Small random factor (0-3) to prevent identical plans
  score += Math.random() * 3;

  return score;
}

export function selectBestRecipe(candidates: Recipe[], context: ScoringContext): Recipe | null {
  if (candidates.length === 0) return null;

  const scored = candidates.map(r => ({
    recipe: r,
    score: scoreRecipe(r, context),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored[0].recipe;
}
