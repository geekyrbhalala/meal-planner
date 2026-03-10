import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { CuisineBadge } from '../ui/Badge';
import type { Recipe, MealType, CuisineType } from '../../types/recipe';
import { useRecipeStore } from '../../store/recipe-store';
import { CUISINE_LABELS } from '../../types/recipe';

interface RecipePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (recipeId: string) => void;
  mealType: MealType;
}

export function RecipePicker({ isOpen, onClose, onSelect, mealType }: RecipePickerProps) {
  const [search, setSearch] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState<CuisineType | ''>('');
  const getAllRecipes = useRecipeStore(s => s.getAllRecipes);

  const recipes = getAllRecipes()
    .filter(r => r.mealType === mealType)
    .filter(r => !cuisineFilter || r.cuisine === cuisineFilter)
    .filter(r =>
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.includes(search.toLowerCase()))
    );

  const handleSelect = (recipe: Recipe) => {
    onSelect(recipe.id);
    onClose();
    setSearch('');
    setCuisineFilter('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Pick a ${mealType}`} size="lg">
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
          <select
            value={cuisineFilter}
            onChange={e => setCuisineFilter(e.target.value as CuisineType | '')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Cuisines</option>
            {(Object.entries(CUISINE_LABELS) as [CuisineType, string][]).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {recipes.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">No recipes found</p>
          )}
          {recipes.map(recipe => (
            <button
              key={recipe.id}
              onClick={() => handleSelect(recipe)}
              className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-green-400 hover:bg-green-50/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-slate-800">{recipe.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CuisineBadge cuisine={recipe.cuisine} />
                    <span className="text-xs text-slate-500">{recipe.nutrition.calories} cal</span>
                    <span className="text-xs text-green-600 font-medium">{recipe.nutrition.protein}g protein</span>
                    <span className="text-xs text-slate-400">{recipe.prepTime + recipe.cookTime} min</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
