import type { WeeklyNutrition } from '../../utils/nutrition-calc';
import { MacroBar } from './MacroBar';
import { ProteinTracker } from './ProteinTracker';
import { DAY_SHORT } from '../../types/meal-plan';

interface NutritionDashboardProps {
  nutrition: WeeklyNutrition;
}

export function NutritionDashboard({ nutrition }: NutritionDashboardProps) {
  const { dailyBreakdown, weeklyAverage } = nutrition;

  const statCards = [
    { label: 'Calories', value: weeklyAverage.calories, unit: 'kcal', emoji: '🔥', gradient: 'from-orange-50 to-red-50', border: 'border-orange-200', text: 'text-orange-700' },
    { label: 'Protein', value: weeklyAverage.protein, unit: 'g', emoji: '💪', gradient: 'from-green-50 to-emerald-50', border: 'border-green-200', text: 'text-green-700' },
    { label: 'Carbs', value: weeklyAverage.carbs, unit: 'g', emoji: '🌾', gradient: 'from-blue-50 to-sky-50', border: 'border-blue-200', text: 'text-blue-700' },
    { label: 'Fat', value: weeklyAverage.fat, unit: 'g', emoji: '🧈', gradient: 'from-yellow-50 to-amber-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    { label: 'Fiber', value: weeklyAverage.fiber, unit: 'g', emoji: '🥦', gradient: 'from-purple-50 to-violet-50', border: 'border-purple-200', text: 'text-purple-700' },
  ];

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {statCards.map(n => (
          <div key={n.label} className={`rounded-xl p-3 sm:p-4 bg-gradient-to-br ${n.gradient} border ${n.border} ${n.text}`}>
            <p className="text-xs opacity-75 flex items-center gap-1">{n.emoji} {n.label}</p>
            <p className="text-xl sm:text-2xl font-bold mt-1">{n.value}<span className="text-xs font-normal opacity-60"> {n.unit}</span></p>
            <p className="text-[10px] opacity-50 mt-0.5">daily avg</p>
          </div>
        ))}
      </div>

      {/* Protein tracker */}
      <ProteinTracker averageProtein={weeklyAverage.protein} />

      {/* Macro chart */}
      <div className="bg-white/90 rounded-2xl border border-slate-200/60 p-4 sm:p-5 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          📊 Daily Macros Breakdown
        </h3>
        <MacroBar dailyBreakdown={dailyBreakdown} />
      </div>

      {/* Daily breakdown table */}
      <div className="bg-white/90 rounded-2xl border border-slate-200/60 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600">
                <th className="text-left px-4 py-3 font-semibold">Day</th>
                <th className="text-right px-3 py-3 font-semibold">🔥 Cal</th>
                <th className="text-right px-3 py-3 font-semibold text-green-600">💪 Protein</th>
                <th className="text-right px-3 py-3 font-semibold hidden sm:table-cell">🌾 Carbs</th>
                <th className="text-right px-3 py-3 font-semibold hidden sm:table-cell">🧈 Fat</th>
                <th className="text-right px-4 py-3 font-semibold hidden md:table-cell">🥦 Fiber</th>
              </tr>
            </thead>
            <tbody>
              {dailyBreakdown.map((day, i) => (
                <tr key={day.date} className="border-t border-slate-100/80 hover:bg-white/60 transition-colors">
                  <td className="px-4 py-2.5 font-semibold">{DAY_SHORT[i]}</td>
                  <td className="text-right px-3 py-2.5 tabular-nums">{day.total.calories}</td>
                  <td className={`text-right px-3 py-2.5 font-semibold tabular-nums ${day.total.protein >= 60 ? 'text-green-600' : 'text-amber-600'}`}>
                    {day.total.protein}g
                  </td>
                  <td className="text-right px-3 py-2.5 tabular-nums hidden sm:table-cell">{day.total.carbs}g</td>
                  <td className="text-right px-3 py-2.5 tabular-nums hidden sm:table-cell">{day.total.fat}g</td>
                  <td className="text-right px-4 py-2.5 tabular-nums hidden md:table-cell">{day.total.fiber}g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
