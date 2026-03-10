import { useMealPlanStore } from '../../store/meal-plan-store';
import { Button } from '../ui/Button';

export function GenerateButton() {
  const { getCurrentPlan, generatePlan, regeneratePlan } = useMealPlanStore();
  const plan = getCurrentPlan();

  const hasLockedSlots = plan?.days.some(
    d => d.breakfast.locked || d.dinner.locked
  );

  if (!plan) {
    return (
      <Button onClick={() => generatePlan()} size="lg" className="shadow-lg shadow-green-200">
        🎲 Generate Meal Plan
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button onClick={() => regeneratePlan()} variant="primary" className="shadow-md shadow-green-100">
        🔄 Shuffle
      </Button>
      {hasLockedSlots && (
        <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
          🔒 Locked meals kept
        </span>
      )}
    </div>
  );
}
