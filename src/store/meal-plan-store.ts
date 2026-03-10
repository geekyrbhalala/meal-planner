import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WeeklyMealPlan } from '../types/meal-plan';
import { generateWeeklyPlan } from '../algorithm/meal-planner';
import { allRecipes } from '../data/recipes';
import { getWeekStartDate } from '../utils/date';

interface MealPlanState {
  plans: Record<string, WeeklyMealPlan>;
  currentWeek: string;

  setCurrentWeek: (week: string) => void;
  getCurrentPlan: () => WeeklyMealPlan | null;
  generatePlan: (weekStart?: string) => void;
  regeneratePlan: () => void;
  toggleLock: (date: string, meal: 'breakfast' | 'dinner') => void;
  swapMeals: (
    date1: string, meal1: 'breakfast' | 'dinner',
    date2: string, meal2: 'breakfast' | 'dinner'
  ) => void;
  assignRecipe: (date: string, meal: 'breakfast' | 'dinner', recipeId: string) => void;
  clearSlot: (date: string, meal: 'breakfast' | 'dinner') => void;
}

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      plans: {},
      currentWeek: getWeekStartDate(),

      setCurrentWeek: (week) => set({ currentWeek: week }),

      getCurrentPlan: () => {
        const { plans, currentWeek } = get();
        return plans[currentWeek] ?? null;
      },

      generatePlan: (weekStart) => {
        const week = weekStart ?? get().currentWeek;
        const plan = generateWeeklyPlan(allRecipes, week);
        set(state => ({
          plans: { ...state.plans, [week]: plan },
          currentWeek: week,
        }));
      },

      regeneratePlan: () => {
        const { currentWeek, plans } = get();
        const existingPlan = plans[currentWeek];

        // Collect locked slots
        const lockedSlots: Record<string, { breakfast?: string; dinner?: string }> = {};
        if (existingPlan) {
          for (const day of existingPlan.days) {
            const locks: { breakfast?: string; dinner?: string } = {};
            if (day.breakfast.locked && day.breakfast.recipeId) {
              locks.breakfast = day.breakfast.recipeId;
            }
            if (day.dinner.locked && day.dinner.recipeId) {
              locks.dinner = day.dinner.recipeId;
            }
            if (locks.breakfast || locks.dinner) {
              lockedSlots[day.date] = locks;
            }
          }
        }

        const plan = generateWeeklyPlan(allRecipes, currentWeek, lockedSlots);
        set(state => ({
          plans: { ...state.plans, [currentWeek]: plan },
        }));
      },

      toggleLock: (date, meal) => {
        set(state => {
          const plan = state.plans[state.currentWeek];
          if (!plan) return state;

          const updatedDays = plan.days.map(day => {
            if (day.date !== date) return day;
            return {
              ...day,
              [meal]: { ...day[meal], locked: !day[meal].locked },
            };
          });

          return {
            plans: {
              ...state.plans,
              [state.currentWeek]: { ...plan, days: updatedDays },
            },
          };
        });
      },

      swapMeals: (date1, meal1, date2, meal2) => {
        set(state => {
          const plan = state.plans[state.currentWeek];
          if (!plan) return state;

          const day1 = plan.days.find(d => d.date === date1);
          const day2 = plan.days.find(d => d.date === date2);
          if (!day1 || !day2) return state;

          const slot1 = day1[meal1];
          const slot2 = day2[meal2];

          const updatedDays = plan.days.map(day => {
            if (day.date === date1) {
              return { ...day, [meal1]: { ...slot2, locked: slot1.locked } };
            }
            if (day.date === date2) {
              return { ...day, [meal2]: { ...slot1, locked: slot2.locked } };
            }
            return day;
          });

          return {
            plans: {
              ...state.plans,
              [state.currentWeek]: { ...plan, days: updatedDays },
            },
          };
        });
      },

      assignRecipe: (date, meal, recipeId) => {
        set(state => {
          const plan = state.plans[state.currentWeek];
          if (!plan) return state;

          const updatedDays = plan.days.map(day => {
            if (day.date !== date) return day;
            return {
              ...day,
              [meal]: { ...day[meal], recipeId },
            };
          });

          return {
            plans: {
              ...state.plans,
              [state.currentWeek]: { ...plan, days: updatedDays },
            },
          };
        });
      },

      clearSlot: (date, meal) => {
        set(state => {
          const plan = state.plans[state.currentWeek];
          if (!plan) return state;

          const updatedDays = plan.days.map(day => {
            if (day.date !== date) return day;
            return {
              ...day,
              [meal]: { recipeId: null, locked: false },
            };
          });

          return {
            plans: {
              ...state.plans,
              [state.currentWeek]: { ...plan, days: updatedDays },
            },
          };
        });
      },
    }),
    { name: 'meal-planner-plans' }
  )
);
