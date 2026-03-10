import { useMealPlanStore } from '../store/meal-plan-store';
import { useRecipeStore } from '../store/recipe-store';
import { usePantryStore } from '../store/pantry-store';
import { syncService } from './sync-service';

let isSyncing = false;

/**
 * Subscribe to store changes and auto-sync to DynamoDB.
 * Call this once after the user logs in.
 * Returns an unsubscribe function to call on logout.
 */
export function startCloudSync(): () => void {
  const unsubscribers: Array<() => void> = [];

  // Debounce helper
  const debounce = (fn: () => void, ms: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  };

  // Sync meal plans when they change
  const syncMealPlan = debounce(() => {
    if (isSyncing) return;
    const { plans, currentWeek } = useMealPlanStore.getState();
    const plan = plans[currentWeek];
    if (plan) {
      syncService.syncMealPlanToCloud(currentWeek, plan);
    }
  }, 2000);

  unsubscribers.push(
    useMealPlanStore.subscribe(syncMealPlan)
  );

  // Sync custom recipes when they change
  const syncRecipes = debounce(() => {
    if (isSyncing) return;
    const { customRecipes } = useRecipeStore.getState();
    for (const recipe of customRecipes) {
      syncService.syncCustomRecipeToCloud(recipe.id, recipe);
    }
  }, 2000);

  unsubscribers.push(
    useRecipeStore.subscribe(syncRecipes)
  );

  // Sync pantry when it changes
  const syncPantry = debounce(() => {
    if (isSyncing) return;
    const { items } = usePantryStore.getState();
    syncService.syncPantryToCloud(items);
  }, 2000);

  unsubscribers.push(
    usePantryStore.subscribe(syncPantry)
  );

  return () => {
    for (const unsub of unsubscribers) {
      unsub();
    }
  };
}

/**
 * Pull all user data from DynamoDB and merge into local stores.
 * Call this once after login to hydrate from cloud.
 */
export async function pullFromCloud(): Promise<void> {
  isSyncing = true;

  try {
    // Load custom recipes from cloud
    const cloudRecipes = await syncService.loadCustomRecipesFromCloud();
    if (cloudRecipes.length > 0) {
      const localCustom = useRecipeStore.getState().customRecipes;
      const localIds = new Set(localCustom.map(r => (r as { id: string }).id));

      // Merge: add cloud recipes not already local
      for (const recipe of cloudRecipes) {
        const r = recipe as { id: string };
        if (!localIds.has(r.id)) {
          useRecipeStore.setState(state => ({
            customRecipes: [...state.customRecipes, recipe as never],
          }));
        }
      }
    }

    // Load pantry from cloud
    const cloudPantry = await syncService.loadPantryFromCloud();
    if (cloudPantry && Array.isArray(cloudPantry) && cloudPantry.length > 0) {
      const localPantry = usePantryStore.getState().items;
      if (localPantry.length === 0) {
        usePantryStore.setState({ items: cloudPantry as never });
      }
    }

    // Load current week meal plan from cloud
    const currentWeek = useMealPlanStore.getState().currentWeek;
    const cloudPlan = await syncService.loadMealPlanFromCloud(currentWeek);
    if (cloudPlan) {
      const localPlan = useMealPlanStore.getState().plans[currentWeek];
      if (!localPlan) {
        useMealPlanStore.setState(state => ({
          plans: { ...state.plans, [currentWeek]: cloudPlan as never },
        }));
      }
    }
  } catch (err) {
    console.warn('Cloud sync pull failed:', err);
  } finally {
    isSyncing = false;
  }
}
