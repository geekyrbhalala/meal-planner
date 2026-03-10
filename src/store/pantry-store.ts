import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PantryItem } from '../types/pantry';
import { DEFAULT_ALWAYS_IN_STOCK } from '../types/pantry';
import { normalizeIngredientName } from '../utils/ingredient-parser';
import type { GroceryCategory } from '../types/recipe';

interface PantryState {
  items: PantryItem[];
  initialized: boolean;

  initializeDefaults: () => void;
  addItem: (item: PantryItem) => void;
  updateQuantity: (name: string, quantity: number) => void;
  removeItem: (name: string) => void;
  toggleAlwaysInStock: (name: string) => void;
  getItem: (name: string) => PantryItem | undefined;
  getByCategory: (category: GroceryCategory) => PantryItem[];
}

export const usePantryStore = create<PantryState>()(
  persist(
    (set, get) => ({
      items: [],
      initialized: false,

      initializeDefaults: () => {
        if (get().initialized) return;
        set({
          items: DEFAULT_ALWAYS_IN_STOCK,
          initialized: true,
        });
      },

      addItem: (item) => {
        const normalized = normalizeIngredientName(item.ingredientName);
        const existing = get().items.find(
          i => normalizeIngredientName(i.ingredientName) === normalized
        );
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              normalizeIngredientName(i.ingredientName) === normalized
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          }));
        } else {
          set(state => ({ items: [...state.items, { ...item, ingredientName: normalized }] }));
        }
      },

      updateQuantity: (name, quantity) => {
        const normalized = normalizeIngredientName(name);
        set(state => ({
          items: state.items.map(i =>
            normalizeIngredientName(i.ingredientName) === normalized
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      removeItem: (name) => {
        const normalized = normalizeIngredientName(name);
        set(state => ({
          items: state.items.filter(
            i => normalizeIngredientName(i.ingredientName) !== normalized
          ),
        }));
      },

      toggleAlwaysInStock: (name) => {
        const normalized = normalizeIngredientName(name);
        set(state => ({
          items: state.items.map(i =>
            normalizeIngredientName(i.ingredientName) === normalized
              ? { ...i, alwaysInStock: !i.alwaysInStock }
              : i
          ),
        }));
      },

      getItem: (name) => {
        const normalized = normalizeIngredientName(name);
        return get().items.find(
          i => normalizeIngredientName(i.ingredientName) === normalized
        );
      },

      getByCategory: (category) => {
        return get().items.filter(i => i.category === category);
      },
    }),
    { name: 'meal-planner-pantry' }
  )
);
