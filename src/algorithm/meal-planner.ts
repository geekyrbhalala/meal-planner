import type { Recipe } from '../types/recipe';
import type { WeeklyMealPlan, DayPlan, MealSlot } from '../types/meal-plan';
import { getWeekDates } from '../utils/date';
import { applyHardConstraints, isQuickBreakfast } from './constraints';
import { selectBestRecipe } from './scoring';
import { v4 as uuid } from 'uuid';

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateWeeklyPlan(
  allRecipes: Recipe[],
  weekStartDate: string,
  lockedSlots?: Partial<Record<string, { breakfast?: string; dinner?: string }>>
): WeeklyMealPlan {
  const dates = getWeekDates(weekStartDate);
  const usedIds = new Set<string>();

  // Collect locked recipe IDs
  if (lockedSlots) {
    for (const slots of Object.values(lockedSlots)) {
      if (slots?.breakfast) usedIds.add(slots.breakfast);
      if (slots?.dinner) usedIds.add(slots.dinner);
    }
  }

  // Separate pools
  const breakfastPool = allRecipes.filter(r => r.mealType === 'breakfast');
  const dinnerPool = allRecipes.filter(r => r.mealType === 'dinner');

  // Fill breakfasts
  const breakfastAssignments: (string | null)[] = [];
  const availableBreakfasts = shuffle(
    applyHardConstraints(breakfastPool, usedIds).filter(isQuickBreakfast)
  );

  for (let i = 0; i < 7; i++) {
    const dateKey = dates[i];
    const locked = lockedSlots?.[dateKey]?.breakfast;
    if (locked) {
      breakfastAssignments.push(locked);
      continue;
    }

    const candidate = availableBreakfasts.find(r => !usedIds.has(r.id));
    if (candidate) {
      breakfastAssignments.push(candidate.id);
      usedIds.add(candidate.id);
    } else {
      // Fallback: pick any breakfast (allow repeats)
      const fallback = shuffle(breakfastPool.filter(isQuickBreakfast))[0];
      breakfastAssignments.push(fallback?.id ?? null);
    }
  }

  // Fill dinners with scoring
  const dinnerAssignments: (string | null)[] = [];
  const usedDinners: Recipe[] = [];

  for (let i = 0; i < 7; i++) {
    const dateKey = dates[i];
    const locked = lockedSlots?.[dateKey]?.dinner;
    if (locked) {
      const lockedRecipe = dinnerPool.find(r => r.id === locked);
      dinnerAssignments.push(locked);
      if (lockedRecipe) usedDinners.push(lockedRecipe);
      continue;
    }

    const candidates = applyHardConstraints(dinnerPool, usedIds);
    const previousDayRecipe = usedDinners[usedDinners.length - 1] ?? null;

    const best = selectBestRecipe(candidates, {
      usedDinners,
      previousDayRecipe,
      dayIndex: i,
    });

    if (best) {
      dinnerAssignments.push(best.id);
      usedIds.add(best.id);
      usedDinners.push(best);
    } else {
      dinnerAssignments.push(null);
    }
  }

  // Build the plan
  const days: DayPlan[] = dates.map((date, i) => ({
    date,
    dayOfWeek: new Date(date + 'T00:00:00').getDay(),
    breakfast: {
      recipeId: breakfastAssignments[i],
      locked: !!lockedSlots?.[date]?.breakfast,
    } as MealSlot,
    dinner: {
      recipeId: dinnerAssignments[i],
      locked: !!lockedSlots?.[date]?.dinner,
    } as MealSlot,
  }));

  return {
    id: uuid(),
    weekStartDate,
    days,
    generatedAt: new Date().toISOString(),
    isFinalized: false,
  };
}
