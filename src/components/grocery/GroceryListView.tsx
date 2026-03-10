import { useState } from 'react';
import type { GroceryItem } from '../../types/grocery';
import type { GroceryCategory } from '../../types/recipe';
import { GroceryCategorySection } from './GroceryCategory';

interface GroceryListViewProps {
  items: GroceryItem[];
  onToggleItem: (name: string) => void;
}

export function GroceryListView({ items, onToggleItem }: GroceryListViewProps) {
  const [showPantryItems, setShowPantryItems] = useState(false);

  // Group by category
  const grouped = items.reduce<Record<string, GroceryItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort() as GroceryCategory[];
  const toBuyTotal = items.filter(i => i.toBuy > 0).length;
  const checkedTotal = items.filter(i => i.checked).length;
  const pantryTotal = items.filter(i => i.inPantry && i.toBuy <= 0).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="text-sm text-slate-500">
          <span className="font-medium text-slate-700">{toBuyTotal}</span> items to buy
          {checkedTotal > 0 && (
            <> &middot; <span className="text-green-600">{checkedTotal} checked</span></>
          )}
          {pantryTotal > 0 && (
            <> &middot; <span className="text-amber-600">{pantryTotal} in pantry</span></>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
          <input
            type="checkbox"
            checked={showPantryItems}
            onChange={e => setShowPantryItems(e.target.checked)}
            className="rounded text-green-600"
          />
          Show pantry items
        </label>
      </div>

      {categories.map(cat => (
        <GroceryCategorySection
          key={cat}
          category={cat}
          items={grouped[cat]}
          onToggleItem={onToggleItem}
          showPantryItems={showPantryItems}
        />
      ))}

      {items.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg">No grocery list yet</p>
          <p className="text-sm mt-1">Generate a meal plan first to see your grocery list</p>
        </div>
      )}
    </div>
  );
}
