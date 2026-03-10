import { useState } from 'react';
import { useRecipeStore } from '../store/recipe-store';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { RecipeDetailModal } from '../components/recipes/RecipeDetailModal';
import { RecipeForm } from '../components/recipes/RecipeForm';
import { Button } from '../components/ui/Button';
import type { Recipe, CuisineType, MealType } from '../types/recipe';
import { CUISINE_LABELS } from '../types/recipe';

export function RecipesPage() {
  const getAllRecipes = useRecipeStore(s => s.getAllRecipes);
  const addRecipe = useRecipeStore(s => s.addRecipe);
  const updateRecipe = useRecipeStore(s => s.updateRecipe);
  const deleteRecipe = useRecipeStore(s => s.deleteRecipe);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [search, setSearch] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState<CuisineType | ''>('');
  const [mealFilter, setMealFilter] = useState<MealType | ''>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const recipes = getAllRecipes()
    .filter(r => !cuisineFilter || r.cuisine === cuisineFilter)
    .filter(r => !mealFilter || r.mealType === mealFilter)
    .filter(r =>
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.includes(search.toLowerCase()))
    );

  const customCount = getAllRecipes().filter(r => !r.isDefault).length;

  const handleEdit = (recipe: Recipe) => {
    setSelectedRecipe(null);
    setEditingRecipe(recipe);
  };

  const handleDelete = (recipe: Recipe) => {
    if (confirm(`Delete "${recipe.name}"? This cannot be undone.`)) {
      deleteRecipe(recipe.id);
      setSelectedRecipe(null);
    }
  };

  const handleSaveEdit = (data: Omit<Recipe, 'id' | 'isDefault'>) => {
    if (editingRecipe) {
      updateRecipe(editingRecipe.id, data);
      setEditingRecipe(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            👨‍🍳 Recipe Collection
          </h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-slate-500">{recipes.length} recipes</span>
            {customCount > 0 && (
              <span className="inline-flex items-center text-[11px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-200">
                ✨ {customCount} custom
              </span>
            )}
          </div>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="shadow-md">
          ➕ Add Recipe
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/80 pl-9 pr-3 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
          />
        </div>
        <select
          value={cuisineFilter}
          onChange={e => setCuisineFilter(e.target.value as CuisineType | '')}
          className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm"
        >
          <option value="">🌍 All Cuisines</option>
          {(Object.entries(CUISINE_LABELS) as [CuisineType, string][]).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          value={mealFilter}
          onChange={e => setMealFilter(e.target.value as MealType | '')}
          className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm"
        >
          <option value="">🍽️ All Meals</option>
          <option value="breakfast">🌅 Breakfast</option>
          <option value="dinner">🌙 Dinner</option>
        </select>
      </div>

      {/* Recipe grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {recipes.map((recipe, i) => (
          <div key={recipe.id} className="slide-up" style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
            <RecipeCard
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
            />
          </div>
        ))}
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-16">
          <span className="text-5xl">🍳</span>
          <p className="text-slate-400 mt-3">No recipes match your filters</p>
          <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <RecipeForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={addRecipe}
      />

      <RecipeForm
        isOpen={!!editingRecipe}
        onClose={() => setEditingRecipe(null)}
        onSave={handleSaveEdit}
        initialData={editingRecipe}
      />
    </div>
  );
}
