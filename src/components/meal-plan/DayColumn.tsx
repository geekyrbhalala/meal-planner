import { useState } from 'react';
import type { DayPlan } from '../../types/meal-plan';
import { DAY_SHORT } from '../../types/meal-plan';
import { formatDateShort, isToday } from '../../utils/date';
import { getRecipeById } from '../../data/recipes';
import { MealCard } from './MealCard';
import { RecipePicker } from './RecipePicker';
import { useMealPlanStore } from '../../store/meal-plan-store';
import type { MealType } from '../../types/recipe';

interface DayColumnProps {
  day: DayPlan;
}

export function DayColumn({ day }: DayColumnProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMealType, setPickerMealType] = useState<MealType>('breakfast');
  const { toggleLock, clearSlot, assignRecipe } = useMealPlanStore();

  const breakfastRecipe = day.breakfast.recipeId ? getRecipeById(day.breakfast.recipeId) ?? null : null;
  const dinnerRecipe = day.dinner.recipeId ? getRecipeById(day.dinner.recipeId) ?? null : null;

  const today = isToday(day.date);

  const openPicker = (mealType: MealType) => {
    setPickerMealType(mealType);
    setPickerOpen(true);
  };

  const handleSelect = (recipeId: string) => {
    assignRecipe(day.date, pickerMealType, recipeId);
  };

  return (
    <div className={`flex flex-col gap-2 rounded-2xl p-2 transition-all duration-300 ${
      today
        ? 'ring-2 ring-green-400 bg-green-50/40 shadow-md shadow-green-100 pulse-glow'
        : 'hover:bg-white/30'
    }`}>
      {/* Day header */}
      <div className={`text-center py-2 px-1 rounded-xl transition-colors ${
        today
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm'
          : 'bg-white/60 text-slate-600 border border-slate-100'
      }`}>
        <p className="text-xs font-bold tracking-wide uppercase">{DAY_SHORT[day.dayOfWeek]}</p>
        <p className={`text-[11px] ${today ? 'text-green-100' : 'text-slate-400'}`}>
          {formatDateShort(day.date)}
        </p>
        {today && <p className="text-[10px] text-green-200 mt-0.5">Today</p>}
      </div>

      {/* Breakfast */}
      <div>
        <p className="text-[11px] font-semibold text-amber-500 mb-1 px-1 flex items-center gap-1">
          <span>🌅</span> Breakfast
        </p>
        <MealCard
          recipe={breakfastRecipe}
          slotId={`${day.date}-breakfast`}
          locked={day.breakfast.locked}
          onToggleLock={() => toggleLock(day.date, 'breakfast')}
          onClear={() => clearSlot(day.date, 'breakfast')}
          onClickRecipe={() => openPicker('breakfast')}
          mealType="breakfast"
        />
      </div>

      {/* Dinner */}
      <div>
        <p className="text-[11px] font-semibold text-indigo-500 mb-1 px-1 flex items-center gap-1">
          <span>🌙</span> Dinner
        </p>
        <MealCard
          recipe={dinnerRecipe}
          slotId={`${day.date}-dinner`}
          locked={day.dinner.locked}
          onToggleLock={() => toggleLock(day.date, 'dinner')}
          onClear={() => clearSlot(day.date, 'dinner')}
          onClickRecipe={() => openPicker('dinner')}
          mealType="dinner"
        />
      </div>

      <RecipePicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
        mealType={pickerMealType}
      />
    </div>
  );
}
