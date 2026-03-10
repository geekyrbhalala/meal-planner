import type { GroceryItem } from '../types/grocery';
import type { GroceryCategory } from '../types/recipe';
import type { WeeklyMealPlan } from '../types/meal-plan';
import type { PantryItem } from '../types/pantry';
import { getRecipeById } from '../data/recipes';
import {
  normalizeIngredientName,
  convertToBaseUnit,
  canConvertUnits,
  roundUpForShopping,
} from '../utils/ingredient-parser';

interface AggregatedIngredient {
  name: string;
  quantity: number;
  unit: string;
  category: GroceryCategory;
  recipeIds: string[];
}

export function generateGroceryList(
  plan: WeeklyMealPlan,
  pantry: PantryItem[]
): GroceryItem[] {
  const aggregation = new Map<string, AggregatedIngredient>();

  for (const day of plan.days) {
    // Process breakfast
    if (day.breakfast.recipeId) {
      const recipe = getRecipeById(day.breakfast.recipeId);
      if (recipe) {
        addRecipeIngredients(aggregation, recipe.id, recipe.ingredients, 1.0);
      }
    }

    // Process dinner (1.5x for next-day lunch)
    if (day.dinner.recipeId) {
      const recipe = getRecipeById(day.dinner.recipeId);
      if (recipe) {
        addRecipeIngredients(aggregation, recipe.id, recipe.ingredients, 1.5);
      }
    }
  }

  // Deduct pantry and build final list
  const items: GroceryItem[] = [];

  for (const [, agg] of aggregation) {
    const pantryItem = pantry.find(
      p => normalizeIngredientName(p.ingredientName) === agg.name
    );

    let inPantry = false;
    let pantryQuantity = 0;
    let toBuy = agg.quantity;

    if (pantryItem) {
      inPantry = true;
      if (pantryItem.alwaysInStock) {
        toBuy = 0;
        pantryQuantity = agg.quantity;
      } else {
        const pantryConverted = canConvertUnits(pantryItem.unit, agg.unit)
          ? convertToBaseUnit(pantryItem.quantity, pantryItem.unit).quantity
          : pantryItem.quantity;
        pantryQuantity = pantryConverted;
        toBuy = Math.max(0, agg.quantity - pantryConverted);
      }
    }

    toBuy = roundUpForShopping(toBuy, agg.unit);

    items.push({
      ingredientName: agg.name,
      totalQuantity: Math.round(agg.quantity),
      unit: agg.unit,
      category: agg.category,
      neededFor: agg.recipeIds,
      inPantry,
      pantryQuantity,
      toBuy,
      checked: false,
    });
  }

  return items.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.ingredientName.localeCompare(b.ingredientName);
  });
}

function addRecipeIngredients(
  aggregation: Map<string, AggregatedIngredient>,
  recipeId: string,
  ingredients: { name: string; quantity: number; unit: string; category: GroceryCategory; optional?: boolean }[],
  multiplier: number
) {
  for (const ing of ingredients) {
    if (ing.optional) continue;

    const normalizedName = normalizeIngredientName(ing.name);
    const converted = convertToBaseUnit(ing.quantity * multiplier, ing.unit);

    const existing = aggregation.get(normalizedName);
    if (existing && canConvertUnits(existing.unit, converted.unit)) {
      existing.quantity += converted.quantity;
      if (!existing.recipeIds.includes(recipeId)) {
        existing.recipeIds.push(recipeId);
      }
    } else if (!existing) {
      aggregation.set(normalizedName, {
        name: normalizedName,
        quantity: converted.quantity,
        unit: converted.unit,
        category: ing.category,
        recipeIds: [recipeId],
      });
    } else {
      // Can't convert, just add raw
      const altKey = `${normalizedName}_${converted.unit}`;
      const altExisting = aggregation.get(altKey);
      if (altExisting) {
        altExisting.quantity += converted.quantity;
        if (!altExisting.recipeIds.includes(recipeId)) {
          altExisting.recipeIds.push(recipeId);
        }
      } else {
        aggregation.set(altKey, {
          name: normalizedName,
          quantity: converted.quantity,
          unit: converted.unit,
          category: ing.category,
          recipeIds: [recipeId],
        });
      }
    }
  }
}
