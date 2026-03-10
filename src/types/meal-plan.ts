export interface MealSlot {
  recipeId: string | null;
  locked: boolean;
}

export interface DayPlan {
  date: string;
  dayOfWeek: number;
  breakfast: MealSlot;
  dinner: MealSlot;
}

export interface WeeklyMealPlan {
  id: string;
  weekStartDate: string;
  days: DayPlan[];
  generatedAt: string;
  isFinalized: boolean;
}

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
