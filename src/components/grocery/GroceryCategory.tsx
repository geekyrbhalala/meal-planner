import { useState } from 'react';
import type { GroceryItem } from '../../types/grocery';
import type { GroceryCategory as GroceryCategoryType } from '../../types/recipe';
import { GROCERY_CATEGORY_LABELS, GROCERY_CATEGORY_ICONS } from '../../types/grocery';
import { GroceryItemRow } from './GroceryItem';

interface GroceryCategoryProps {
  category: GroceryCategoryType;
  items: GroceryItem[];
  onToggleItem: (name: string) => void;
  showPantryItems: boolean;
}

export function GroceryCategorySection({ category, items, onToggleItem, showPantryItems }: GroceryCategoryProps) {
  const [collapsed, setCollapsed] = useState(false);

  const displayItems = showPantryItems ? items : items.filter(i => i.toBuy > 0);
  const toBuyCount = items.filter(i => i.toBuy > 0).length;

  if (displayItems.length === 0) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 w-full text-left px-2 py-2 hover:bg-slate-50 rounded-lg"
      >
        <span className="text-lg">{GROCERY_CATEGORY_ICONS[category]}</span>
        <span className="font-semibold text-sm text-slate-700 flex-1">
          {GROCERY_CATEGORY_LABELS[category]}
        </span>
        <span className="text-xs text-slate-400">{toBuyCount} items</span>
        <span className="text-slate-400 text-sm">{collapsed ? '▶' : '▼'}</span>
      </button>

      {!collapsed && (
        <div className="ml-2 border-l-2 border-slate-100 pl-2">
          {displayItems.map(item => (
            <GroceryItemRow
              key={item.ingredientName}
              item={item}
              onToggle={() => onToggleItem(item.ingredientName)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
