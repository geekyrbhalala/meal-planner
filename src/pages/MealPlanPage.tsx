import { useEffect } from 'react';
import { useMealPlanStore } from '../store/meal-plan-store';
import { WeeklyCalendar } from '../components/meal-plan/WeeklyCalendar';
import { GenerateButton } from '../components/meal-plan/GenerateButton';
import { getRecipeById } from '../data/recipes';

export function MealPlanPage() {
  const { getCurrentPlan, generatePlan, currentWeek } = useMealPlanStore();
  const plan = getCurrentPlan();

  useEffect(() => {
    if (!plan) {
      generatePlan(currentWeek);
    }
  }, [currentWeek]);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-6xl float-animation">🥗</div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Welcome to Meal Planner!</h2>
          <p className="text-slate-500 mt-1">Plan delicious vegetarian meals for your family</p>
        </div>
        <GenerateButton />
      </div>
    );
  }

  const totalMeals = plan.days.reduce((acc, d) => {
    return acc + (d.breakfast.recipeId ? 1 : 0) + (d.dinner.recipeId ? 1 : 0);
  }, 0);

  const avgProtein = Math.round(
    plan.days.reduce((acc, d) => {
      const bk = d.breakfast.recipeId ? getRecipeById(d.breakfast.recipeId)?.nutrition.protein ?? 0 : 0;
      const dn = d.dinner.recipeId ? getRecipeById(d.dinner.recipeId)?.nutrition.protein ?? 0 : 0;
      return acc + bk + dn;
    }, 0) / 7
  );

  const avgCalories = Math.round(
    plan.days.reduce((acc, d) => {
      const bk = d.breakfast.recipeId ? getRecipeById(d.breakfast.recipeId)?.nutrition.calories ?? 0 : 0;
      const dn = d.dinner.recipeId ? getRecipeById(d.dinner.recipeId)?.nutrition.calories ?? 0 : 0;
      return acc + bk + dn;
    }, 0) / 7
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Stats bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            🍽️ Weekly Meal Plan
          </h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs bg-white/70 px-2.5 py-1 rounded-full border border-slate-200">
              🍳 <strong>{totalMeals}/14</strong> meals
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-green-50 px-2.5 py-1 rounded-full border border-green-200 text-green-700">
              💪 <strong>{avgProtein}g</strong> protein/day
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-amber-700">
              🔥 <strong>{avgCalories}</strong> cal/day
            </span>
          </div>
        </div>
        <GenerateButton />
      </div>

      {/* Calendar */}
      <WeeklyCalendar plan={plan} />

      {/* Tip */}
      <div className="glass-card rounded-xl p-4 border border-green-200/50">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <div>
            <p className="text-sm font-medium text-slate-700">Pro tip</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Dinner is cooked in extra quantity to serve as next day&apos;s lunch.
              Lock your favorites 🔒 then hit Shuffle to mix up the rest!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
