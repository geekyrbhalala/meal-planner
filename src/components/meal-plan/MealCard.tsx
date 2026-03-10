import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Recipe } from '../../types/recipe';
import { CuisineBadge } from '../ui/Badge';
import { CUISINE_COLORS } from '../../types/recipe';

interface MealCardProps {
  recipe: Recipe | null;
  slotId: string;
  locked: boolean;
  onToggleLock: () => void;
  onClear: () => void;
  onClickRecipe: () => void;
  mealType: 'breakfast' | 'dinner';
}

const MEAL_EMOJIS: Record<string, string[]> = {
  'gujarati': ['🫓', '🥘', '🍛'],
  'north-indian': ['🧈', '🍛', '🫕'],
  'south-indian': ['🥞', '🍚', '🥥'],
  'continental': ['🍝', '🍕', '🌯'],
  'indo-chinese': ['🥡', '🍜', '🥟'],
};

export function MealCard({
  recipe,
  slotId,
  locked,
  onToggleLock,
  onClear,
  onClickRecipe,
  mealType,
}: MealCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: slotId, disabled: locked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!recipe) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border-2 border-dashed border-slate-200/80 rounded-xl p-3 min-h-[90px] sm:min-h-[100px] flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50/40 transition-all duration-200 group"
        onClick={onClickRecipe}
      >
        <span className="text-2xl opacity-30 group-hover:opacity-60 transition-opacity">
          {mealType === 'breakfast' ? '🌅' : '🌙'}
        </span>
        <span className="text-slate-400 text-xs mt-1 group-hover:text-green-600">+ Add {mealType}</span>
      </div>
    );
  }

  const cuisineEmojis = MEAL_EMOJIS[recipe.cuisine] || ['🍽️'];
  const foodEmoji = cuisineEmojis[Math.abs(recipe.id.charCodeAt(recipe.id.length - 1)) % cuisineEmojis.length];
  const accentColor = CUISINE_COLORS[recipe.cuisine];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl p-3 min-h-[90px] sm:min-h-[100px] transition-all duration-200 pop-in overflow-hidden ${
        locked
          ? 'bg-gradient-to-br from-amber-50 to-amber-50/50 border-2 border-amber-300 shadow-sm'
          : 'bg-white/90 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5'
      } ${isDragging ? 'shadow-xl ring-2 ring-green-400 scale-105' : ''}`}
    >
      {/* Cuisine accent stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start justify-between gap-1 mt-0.5">
        <div
          className="flex-1 cursor-pointer min-w-0"
          onClick={onClickRecipe}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-base shrink-0">{foodEmoji}</span>
            <p className="font-semibold text-sm text-slate-800 leading-tight truncate">{recipe.name}</p>
          </div>
          {recipe.nameGujarati && (
            <p className="text-[11px] text-slate-400 mt-0.5 truncate ml-6">{recipe.nameGujarati}</p>
          )}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={onToggleLock}
            className={`p-1 rounded-lg text-xs transition-colors ${
              locked ? 'text-amber-500 bg-amber-100' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
            }`}
            title={locked ? 'Unlock' : 'Lock'}
          >
            {locked ? '🔒' : '🔓'}
          </button>
          <button
            {...attributes}
            {...listeners}
            className="p-1 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-100 cursor-grab active:cursor-grabbing transition-colors"
            title="Drag to swap"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <circle cx="4" cy="3" r="1.2"/><circle cx="10" cy="3" r="1.2"/>
              <circle cx="4" cy="7" r="1.2"/><circle cx="10" cy="7" r="1.2"/>
              <circle cx="4" cy="11" r="1.2"/><circle cx="10" cy="11" r="1.2"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
        <CuisineBadge cuisine={recipe.cuisine} />
        <span className="text-[11px] text-slate-400 font-medium tabular-nums">{recipe.nutrition.calories}cal</span>
        <span className="text-[11px] text-green-600 font-bold tabular-nums">{recipe.nutrition.protein}g P</span>
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6.5"/><path d="M8 4v4l3 2"/></svg>
          {recipe.prepTime + recipe.cookTime}m
        </span>
        <button
          onClick={onClear}
          className="text-[11px] text-slate-300 hover:text-red-400 transition-colors px-1"
          title="Remove"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
