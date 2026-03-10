import { useMealPlanStore } from '../../store/meal-plan-store';
import { formatWeekRange, getPreviousWeekStart, getNextWeekStart, getWeekStartDate } from '../../utils/date';
import { Button } from '../ui/Button';

const MEAL_GREETINGS = [
  'Happy cooking! 🍳',
  'What\'s on the menu? 🥘',
  'Fuel your week! 💪',
  'Eat well, live well! 🌿',
  'Fresh flavors await! 🌶️',
  'Spice up your week! ✨',
  'Nourish your family! 🥗',
];

export function Header() {
  const { currentWeek, setCurrentWeek } = useMealPlanStore();

  const goToPrevious = () => setCurrentWeek(getPreviousWeekStart(currentWeek));
  const goToNext = () => setCurrentWeek(getNextWeekStart(currentWeek));
  const goToThisWeek = () => setCurrentWeek(getWeekStartDate());

  const isCurrentWeek = currentWeek === getWeekStartDate();
  const greeting = MEAL_GREETINGS[new Date().getDay()];

  return (
    <header className="glass-card border-b border-white/40 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={goToPrevious}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            title="Previous week"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className="text-center">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-800">
              {formatWeekRange(currentWeek)}
            </h2>
            <p className="text-[11px] text-slate-400 hidden sm:block">{greeting}</p>
          </div>
          <button
            onClick={goToNext}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            title="Next week"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        {!isCurrentWeek && (
          <Button variant="ghost" size="sm" onClick={goToThisWeek}>
            Today
          </Button>
        )}
      </div>
    </header>
  );
}
