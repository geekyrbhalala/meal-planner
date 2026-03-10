import { useEffect, useState } from 'react';
import { useMealPlanStore } from '../store/meal-plan-store';
import { useGroceryStore } from '../store/grocery-store';
import { usePantryStore } from '../store/pantry-store';
import { GroceryListView } from '../components/grocery/GroceryListView';
import { Button } from '../components/ui/Button';
import { exportGroceryListAsText, copyToClipboard } from '../utils/export';

export function GroceryPage() {
  const getCurrentPlan = useMealPlanStore(s => s.getCurrentPlan);
  const plan = getCurrentPlan();
  const { items, generate, toggleChecked } = useGroceryStore();
  const pantryItems = usePantryStore(s => s.items);
  const initPantry = usePantryStore(s => s.initializeDefaults);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    initPantry();
  }, []);

  useEffect(() => {
    if (plan) {
      generate(plan, pantryItems);
    }
  }, [plan, pantryItems]);

  const handleCopy = async () => {
    const text = exportGroceryListAsText(items);
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    if (plan) {
      generate(plan, pantryItems);
    }
  };

  const toBuyCount = items.filter(i => i.toBuy > 0).length;
  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            🛒 Grocery List
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Smart list from your meal plan — pantry items auto-deducted
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? '✅ Copied!' : '📋 Copy List'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            🔄 Refresh
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      {items.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs bg-white/70 px-2.5 py-1 rounded-full border border-slate-200">
            🧾 <strong>{toBuyCount}</strong> items to buy
          </span>
          {checkedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs bg-green-50 px-2.5 py-1 rounded-full border border-green-200 text-green-700">
              ✅ <strong>{checkedCount}</strong> checked off
            </span>
          )}
          {checkedCount === toBuyCount && toBuyCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 text-emerald-700 font-medium">
              🎉 All done! Shopping complete!
            </span>
          )}
        </div>
      )}

      <GroceryListView items={items} onToggleItem={toggleChecked} />
    </div>
  );
}
