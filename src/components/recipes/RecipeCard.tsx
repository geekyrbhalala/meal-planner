import type { Recipe } from '../../types/recipe';
import { Card, CardContent } from '../ui/Card';
import { CuisineBadge, Badge } from '../ui/Badge';
import { CUISINE_COLORS } from '../../types/recipe';

const CUISINE_FOOD_EMOJI: Record<string, string[]> = {
  'gujarati': ['🫓', '🥘', '🍛', '🧆'],
  'north-indian': ['🧈', '🍛', '🫕', '🥙'],
  'south-indian': ['🥞', '🍚', '🥥', '🫖'],
  'continental': ['🍝', '🍕', '🌯', '🥗'],
  'indo-chinese': ['🥡', '🍜', '🥟', '🥢'],
};

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const emojis = CUISINE_FOOD_EMOJI[recipe.cuisine] || ['🍽️'];
  const emoji = emojis[Math.abs(recipe.id.charCodeAt(recipe.id.length - 1)) % emojis.length];
  const accentColor = CUISINE_COLORS[recipe.cuisine];

  return (
    <Card onClick={onClick} className="h-full overflow-hidden group">
      {/* Accent top bar */}
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)` }} />
      <CardContent>
        <div className="space-y-2.5">
          <div className="flex items-start gap-2">
            <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">{emoji}</span>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-800 leading-tight">{recipe.name}</h3>
              {recipe.nameGujarati && (
                <p className="text-[11px] text-slate-400 truncate">{recipe.nameGujarati}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <CuisineBadge cuisine={recipe.cuisine} />
            <Badge>{recipe.mealType === 'breakfast' ? '🌅 breakfast' : '🌙 dinner'}</Badge>
            {recipe.tags.includes('high-protein') && (
              <Badge color="#16a34a">💪 High Protein</Badge>
            )}
            {!recipe.isDefault && (
              <Badge color="#8b5cf6">✨ Custom</Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="tabular-nums">🔥 {recipe.nutrition.calories} cal</span>
            <span className="text-green-600 font-semibold tabular-nums">💪 {recipe.nutrition.protein}g</span>
            <span className="tabular-nums">⏱️ {recipe.prepTime + recipe.cookTime}m</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
