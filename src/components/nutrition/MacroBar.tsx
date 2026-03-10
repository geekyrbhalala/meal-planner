import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DailyNutrition } from '../../utils/nutrition-calc';
import { DAY_SHORT } from '../../types/meal-plan';

interface MacroBarProps {
  dailyBreakdown: DailyNutrition[];
}

export function MacroBar({ dailyBreakdown }: MacroBarProps) {
  const data = dailyBreakdown.map((d, i) => ({
    day: DAY_SHORT[i],
    Protein: d.total.protein,
    Carbs: d.total.carbs,
    Fat: d.total.fat,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Protein" fill="#16a34a" stackId="a" />
          <Bar dataKey="Carbs" fill="#3b82f6" stackId="a" />
          <Bar dataKey="Fat" fill="#eab308" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
