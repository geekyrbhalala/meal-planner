import { create } from 'zustand';
import type { GroceryItem } from '../types/grocery';
import type { WeeklyMealPlan } from '../types/meal-plan';
import type { PantryItem } from '../types/pantry';
import { generateGroceryList } from '../algorithm/grocery-generator';

interface GroceryState {
  items: GroceryItem[];
  lastGeneratedFor: string | null;

  generate: (plan: WeeklyMealPlan, pantry: PantryItem[]) => void;
  toggleChecked: (ingredientName: string) => void;
  uncheckAll: () => void;
  getItemsToBuy: () => GroceryItem[];
  getCheckedItems: () => GroceryItem[];
}

export const useGroceryStore = create<GroceryState>()((set, get) => ({
  items: [],
  lastGeneratedFor: null,

  generate: (plan, pantry) => {
    const items = generateGroceryList(plan, pantry);
    set({ items, lastGeneratedFor: plan.weekStartDate });
  },

  toggleChecked: (ingredientName) => {
    set(state => ({
      items: state.items.map(i =>
        i.ingredientName === ingredientName
          ? { ...i, checked: !i.checked }
          : i
      ),
    }));
  },

  uncheckAll: () => {
    set(state => ({
      items: state.items.map(i => ({ ...i, checked: false })),
    }));
  },

  getItemsToBuy: () => {
    return get().items.filter(i => i.toBuy > 0);
  },

  getCheckedItems: () => {
    return get().items.filter(i => i.checked);
  },
}));
