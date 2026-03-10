import { useState, useEffect } from 'react';
import { usePantryStore } from '../../store/pantry-store';
import { PantryItemRow } from './PantryItemRow';
import { Button } from '../ui/Button';
import type { GroceryCategory } from '../../types/recipe';
import { GROCERY_CATEGORY_LABELS, GROCERY_CATEGORY_ICONS } from '../../types/grocery';

export function PantryPageComponent() {
  const { items, initializeDefaults, addItem } = usePantryStore();
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState(0);
  const [newUnit, setNewUnit] = useState('g');
  const [newCategory, setNewCategory] = useState<GroceryCategory>('vegetables');

  useEffect(() => {
    initializeDefaults();
  }, []);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addItem({
      ingredientName: newName.trim().toLowerCase(),
      quantity: newQty,
      unit: newUnit,
      category: newCategory,
      alwaysInStock: false,
    });
    setNewName('');
    setNewQty(0);
  };

  const alwaysInStock = items.filter(i => i.alwaysInStock);
  const tracked = items.filter(i => !i.alwaysInStock);

  // Group tracked by category
  const groupedTracked = tracked.reduce<Record<string, typeof tracked>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Add new item */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Add Pantry Item</h3>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Ingredient name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="flex-1 min-w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Qty"
            value={newQty || ''}
            onChange={e => setNewQty(Number(e.target.value))}
            className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            min={0}
          />
          <select
            value={newUnit}
            onChange={e => setNewUnit(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
          >
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">L</option>
            <option value="pieces">pieces</option>
            <option value="cups">cups</option>
          </select>
          <select
            value={newCategory}
            onChange={e => setNewCategory(e.target.value as GroceryCategory)}
            className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
          >
            {(Object.entries(GROCERY_CATEGORY_LABELS) as [GroceryCategory, string][]).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <Button onClick={handleAdd} size="sm">Add</Button>
        </div>
      </div>

      {/* Always in stock */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">
          Always In Stock <span className="font-normal text-slate-400">({alwaysInStock.length} items)</span>
        </h3>
        <p className="text-xs text-slate-400 mb-3">These items won't appear on your grocery list</p>
        <div className="space-y-1">
          {alwaysInStock.map(item => (
            <PantryItemRow key={item.ingredientName} item={item} />
          ))}
        </div>
      </div>

      {/* Tracked items */}
      {Object.entries(groupedTracked).map(([cat, catItems]) => (
        <div key={cat} className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            {GROCERY_CATEGORY_ICONS[cat as GroceryCategory]} {GROCERY_CATEGORY_LABELS[cat as GroceryCategory]}
            <span className="font-normal text-slate-400 ml-1">({catItems.length})</span>
          </h3>
          <div className="space-y-1">
            {catItems.map(item => (
              <PantryItemRow key={item.ingredientName} item={item} />
            ))}
          </div>
        </div>
      ))}

      {tracked.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm">
          No tracked pantry items. Add items above to track what you have at home.
        </div>
      )}
    </div>
  );
}
