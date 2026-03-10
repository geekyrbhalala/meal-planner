import type { NutritionInfo } from '../types/recipe';
import type { DayPlan } from '../types/meal-plan';
import { getRecipeById } from '../data/recipes';

export interface DailyNutrition {
  date: string;
  breakfast: NutritionInfo | null;
  dinner: NutritionInfo | null;
  total: NutritionInfo;
}

export interface WeeklyNutrition {
  weekStartDate: string;
  dailyBreakdown: DailyNutrition[];
  weeklyAverage: NutritionInfo;
  proteinGoalMet: boolean;
}

const EMPTY_NUTRITION: NutritionInfo = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
const DAILY_PROTEIN_TARGET = 60;

function addNutrition(a: NutritionInfo, b: NutritionInfo): NutritionInfo {
  return {
    calories: a.calories + b.calories,
    protein: a.protein + b.protein,
    carbs: a.carbs + b.carbs,
    fat: a.fat + b.fat,
    fiber: a.fiber + b.fiber,
  };
}

export function getDailyNutrition(day: DayPlan): DailyNutrition {
  const bRecipe = day.breakfast.recipeId ? getRecipeById(day.breakfast.recipeId) : null;
  const dRecipe = day.dinner.recipeId ? getRecipeById(day.dinner.recipeId) : null;

  const breakfast = bRecipe?.nutrition ?? null;
  const dinner = dRecipe?.nutrition ?? null;

  const total = addNutrition(
    breakfast ?? EMPTY_NUTRITION,
    dinner ?? EMPTY_NUTRITION
  );

  return { date: day.date, breakfast, dinner, total };
}

export function getWeeklyNutrition(days: DayPlan[], weekStartDate: string): WeeklyNutrition {
  const dailyBreakdown = days.map(getDailyNutrition);

  const daysWithMeals = dailyBreakdown.filter(d => d.total.calories > 0);
  const count = Math.max(daysWithMeals.length, 1);

  const sum = daysWithMeals.reduce(
    (acc, d) => addNutrition(acc, d.total),
    { ...EMPTY_NUTRITION }
  );

  const weeklyAverage: NutritionInfo = {
    calories: Math.round(sum.calories / count),
    protein: Math.round(sum.protein / count),
    carbs: Math.round(sum.carbs / count),
    fat: Math.round(sum.fat / count),
    fiber: Math.round(sum.fiber / count),
  };

  return {
    weekStartDate,
    dailyBreakdown,
    weeklyAverage,
    proteinGoalMet: weeklyAverage.protein >= DAILY_PROTEIN_TARGET,
  };
}

export { DAILY_PROTEIN_TARGET };
