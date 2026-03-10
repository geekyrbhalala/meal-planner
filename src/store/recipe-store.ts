import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Recipe, CuisineType, MealType } from '../types/recipe';
import { allRecipes } from '../data/recipes';
import { v4 as uuid } from 'uuid';

interface RecipeState {
  recipes: Recipe[];
  customRecipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id' | 'isDefault'>) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  getAllRecipes: () => Recipe[];
  getByMealType: (type: MealType) => Recipe[];
  getByCuisine: (cuisine: CuisineType) => Recipe[];
  searchRecipes: (query: string) => Recipe[];
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      recipes: allRecipes,
      customRecipes: [],

      addRecipe: (recipe) => {
        const newRecipe: Recipe = {
          ...recipe,
          id: `custom-${uuid()}`,
          isDefault: false,
        };
        set(state => ({
          customRecipes: [...state.customRecipes, newRecipe],
        }));
      },

      updateRecipe: (id, updates) => {
        set(state => ({
          customRecipes: state.customRecipes.map(r =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      deleteRecipe: (id) => {
        set(state => ({
          customRecipes: state.customRecipes.filter(r => r.id !== id),
        }));
      },

      getAllRecipes: () => {
        const state = get();
        return [...state.recipes, ...state.customRecipes];
      },

      getByMealType: (type) => {
        return get().getAllRecipes().filter(r => r.mealType === type);
      },

      getByCuisine: (cuisine) => {
        return get().getAllRecipes().filter(r => r.cuisine === cuisine);
      },

      searchRecipes: (query) => {
        const lower = query.toLowerCase();
        return get().getAllRecipes().filter(r =>
          r.name.toLowerCase().includes(lower) ||
          r.tags.some(t => t.toLowerCase().includes(lower)) ||
          r.cuisine.includes(lower)
        );
      },
    }),
    {
      name: 'meal-planner-recipes',
      partialize: (state) => ({ customRecipes: state.customRecipes }),
    }
  )
);
