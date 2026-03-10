import { useMealPlanStore } from '../store/meal-plan-store';
import { NutritionDashboard } from '../components/nutrition/NutritionDashboard';
import { getWeeklyNutrition } from '../utils/nutrition-calc';

export function NutritionPage() {
  const getCurrentPlan = useMealPlanStore(s => s.getCurrentPlan);
  const currentWeek = useMealPlanStore(s => s.currentWeek);
  const plan = getCurrentPlan();

  if (!plan) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl">📊</span>
        <p className="text-lg text-slate-500 mt-3">No meal plan yet</p>
        <p className="text-sm text-slate-400 mt-1">Generate a meal plan to see nutrition data</p>
      </div>
    );
  }

  const nutrition = getWeeklyNutrition(plan.days, currentWeek);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          💪 Nutrition Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Weekly nutrition summary — high protein vegetarian focus
        </p>
      </div>

      <NutritionDashboard nutrition={nutrition} />
    </div>
  );
}
