import type { Recipe } from '../../types/recipe';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CuisineBadge, Badge } from '../ui/Badge';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
}

export function RecipeDetailModal({ recipe, isOpen, onClose, onEdit, onDelete }: RecipeDetailModalProps) {
  if (!recipe) return null;

  const isCustom = !recipe.isDefault;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={recipe.name} size="lg">
      <div className="space-y-5">
        {recipe.nameGujarati && (
          <p className="text-sm text-slate-400">{recipe.nameGujarati}</p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <CuisineBadge cuisine={recipe.cuisine} />
          <Badge>{recipe.mealType}</Badge>
          <Badge>{recipe.difficulty}</Badge>
          {recipe.tags.map(tag => (
            <Badge key={tag}>{tag}</Badge>
          ))}
          {isCustom && <Badge color="#8b5cf6">Custom</Badge>}
        </div>

        {/* Nutrition */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: 'Calories', value: recipe.nutrition.calories, unit: 'kcal', color: 'text-orange-600' },
            { label: 'Protein', value: recipe.nutrition.protein, unit: 'g', color: 'text-green-600' },
            { label: 'Carbs', value: recipe.nutrition.carbs, unit: 'g', color: 'text-blue-600' },
            { label: 'Fat', value: recipe.nutrition.fat, unit: 'g', color: 'text-yellow-600' },
            { label: 'Fiber', value: recipe.nutrition.fiber, unit: 'g', color: 'text-purple-600' },
          ].map(n => (
            <div key={n.label} className="bg-slate-50 rounded-lg p-2 text-center">
              <p className={`text-lg font-bold ${n.color}`}>{n.value}<span className="text-xs">{n.unit}</span></p>
              <p className="text-xs text-slate-500">{n.label}</p>
            </div>
          ))}
        </div>

        {/* Time and servings */}
        <div className="flex gap-4 text-sm text-slate-600">
          <span>Prep: {recipe.prepTime} min</span>
          <span>Cook: {recipe.cookTime} min</span>
          <span>Serves: {recipe.servings}</span>
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-2">Ingredients</h3>
          <ul className="space-y-1">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                <span className="capitalize">
                  {ing.quantity} {ing.unit} {ing.name}
                  {ing.optional && <span className="text-slate-400 ml-1">(optional)</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-2">Instructions</h3>
          <ol className="space-y-2">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-slate-600">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Protein Boost Tip */}
        {recipe.proteinBoostTip && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <h3 className="text-sm font-semibold text-green-700 mb-1 flex items-center gap-1.5">
              <span>💪</span> Protein Boost Tip
            </h3>
            <p className="text-sm text-green-600">{recipe.proteinBoostTip}</p>
          </div>
        )}

        {/* Flour Alternatives */}
        {recipe.flourAlternatives && recipe.flourAlternatives.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-1.5">
              <span>🌾</span> Healthier Flour Options
            </h3>
            <div className="flex flex-wrap gap-2">
              {recipe.flourAlternatives.map(flour => (
                <span key={flour} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/80 text-xs font-medium text-amber-700 border border-amber-200 capitalize">
                  {flour}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions for custom recipes */}
        {isCustom && (onEdit || onDelete) && (
          <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
            {onEdit && (
              <Button variant="secondary" size="sm" onClick={() => onEdit(recipe)}>
                Edit Recipe
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => onDelete(recipe)}>
                Delete Recipe
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
