import type { PantryItem } from '../../types/pantry';
import { usePantryStore } from '../../store/pantry-store';

interface PantryItemRowProps {
  item: PantryItem;
}

export function PantryItemRow({ item }: PantryItemRowProps) {
  const { updateQuantity, removeItem, toggleAlwaysInStock } = usePantryStore();

  return (
    <div className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg">
      <span className="text-sm font-medium text-slate-700 capitalize flex-1">
        {item.ingredientName}
      </span>

      {!item.alwaysInStock && (
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={item.quantity}
            onChange={e => updateQuantity(item.ingredientName, Number(e.target.value))}
            className="w-20 rounded border border-slate-300 px-2 py-1 text-sm text-right"
            min={0}
          />
          <span className="text-xs text-slate-400 w-8">{item.unit}</span>
        </div>
      )}

      <label className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
        <input
          type="checkbox"
          checked={item.alwaysInStock}
          onChange={() => toggleAlwaysInStock(item.ingredientName)}
          className="rounded text-green-600 w-3.5 h-3.5"
        />
        Always in stock
      </label>

      <button
        onClick={() => removeItem(item.ingredientName)}
        className="text-slate-300 hover:text-red-400 text-sm"
        title="Remove"
      >
        ✕
      </button>
    </div>
  );
}
