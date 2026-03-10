import type { GroceryItem as GroceryItemType } from '../../types/grocery';
import { formatQuantity } from '../../utils/ingredient-parser';
import { Checkbox } from '../ui/Checkbox';

interface GroceryItemProps {
  item: GroceryItemType;
  onToggle: () => void;
}

export function GroceryItemRow({ item, onToggle }: GroceryItemProps) {
  if (item.toBuy <= 0) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 text-slate-400">
        <span className="w-4 h-4 flex items-center justify-center text-green-500">✓</span>
        <span className="text-sm line-through flex-1 capitalize">{item.ingredientName}</span>
        <span className="text-xs">In pantry</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg ${item.checked ? 'opacity-50' : ''}`}>
      <Checkbox checked={item.checked} onChange={onToggle} />
      <span className={`text-sm flex-1 capitalize ${item.checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
        {item.ingredientName}
      </span>
      <span className="text-sm font-medium text-slate-600 tabular-nums">
        {formatQuantity(item.toBuy, item.unit)}
      </span>
      <span className="text-xs text-slate-400">
        ({item.neededFor.length} {item.neededFor.length === 1 ? 'recipe' : 'recipes'})
      </span>
    </div>
  );
}
