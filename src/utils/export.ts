import type { GroceryItem } from '../types/grocery';
import type { GroceryCategory } from '../types/recipe';
import { GROCERY_CATEGORY_LABELS } from '../types/grocery';
import { formatQuantity } from './ingredient-parser';

export function exportGroceryListAsText(items: GroceryItem[]): string {
  const toBuyItems = items.filter(i => i.toBuy > 0);

  const grouped = toBuyItems.reduce<Record<string, GroceryItem[]>>((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const lines: string[] = ['GROCERY LIST', '============', ''];

  const categories = Object.keys(grouped).sort() as GroceryCategory[];
  for (const cat of categories) {
    const label = GROCERY_CATEGORY_LABELS[cat] ?? cat;
    lines.push(`${label.toUpperCase()}`);
    lines.push('-'.repeat(label.length));
    for (const item of grouped[cat].sort((a, b) => a.ingredientName.localeCompare(b.ingredientName))) {
      lines.push(`  [ ] ${item.ingredientName} — ${formatQuantity(item.toBuy, item.unit)}`);
    }
    lines.push('');
  }

  lines.push(`Total items: ${toBuyItems.length}`);
  return lines.join('\n');
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
