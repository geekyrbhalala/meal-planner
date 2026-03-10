import { dynamoService } from './dynamodb-service';
import { useAuthStore } from '../store/auth-store';

/**
 * Sync service — bridges Zustand stores with DynamoDB.
 * Only syncs when user is authenticated.
 * localStorage remains the primary store; DynamoDB is the cloud backup.
 */

function getUserId(): string | null {
  const { user, isAuthenticated } = useAuthStore.getState();
  if (!isAuthenticated || !user) return null;
  return user.userId;
}

export const syncService = {
  // ---- Meal Plans ----
  async syncMealPlanToCloud(weekStart: string, planData: unknown): Promise<void> {
    const userId = getUserId();
    if (!userId) return;
    try {
      await dynamoService.saveMealPlan(userId, weekStart, planData);
    } catch (err) {
      console.warn('Failed to sync meal plan to cloud:', err);
    }
  },

  async loadMealPlanFromCloud(weekStart: string): Promise<unknown | null> {
    const userId = getUserId();
    if (!userId) return null;
    try {
      return await dynamoService.getMealPlan(userId, weekStart);
    } catch (err) {
      console.warn('Failed to load meal plan from cloud:', err);
      return null;
    }
  },

  // ---- Pantry ----
  async syncPantryToCloud(pantryData: unknown): Promise<void> {
    const userId = getUserId();
    if (!userId) return;
    try {
      await dynamoService.savePantry(userId, pantryData);
    } catch (err) {
      console.warn('Failed to sync pantry to cloud:', err);
    }
  },

  async loadPantryFromCloud(): Promise<unknown | null> {
    const userId = getUserId();
    if (!userId) return null;
    try {
      return await dynamoService.getPantry(userId);
    } catch (err) {
      console.warn('Failed to load pantry from cloud:', err);
      return null;
    }
  },

  // ---- Custom Recipes ----
  async syncCustomRecipeToCloud(recipeId: string, recipeData: unknown): Promise<void> {
    const userId = getUserId();
    if (!userId) return;
    try {
      await dynamoService.saveCustomRecipe(userId, recipeId, recipeData);
    } catch (err) {
      console.warn('Failed to sync custom recipe to cloud:', err);
    }
  },

  async deleteCustomRecipeFromCloud(recipeId: string): Promise<void> {
    const userId = getUserId();
    if (!userId) return;
    try {
      await dynamoService.deleteCustomRecipe(userId, recipeId);
    } catch (err) {
      console.warn('Failed to delete custom recipe from cloud:', err);
    }
  },

  async loadCustomRecipesFromCloud(): Promise<unknown[]> {
    const userId = getUserId();
    if (!userId) return [];
    try {
      return await dynamoService.listCustomRecipes(userId);
    } catch (err) {
      console.warn('Failed to load custom recipes from cloud:', err);
      return [];
    }
  },

  // ---- Grocery State ----
  async syncGroceryStateToCloud(weekStart: string, groceryData: unknown): Promise<void> {
    const userId = getUserId();
    if (!userId) return;
    try {
      await dynamoService.saveGroceryState(userId, weekStart, groceryData);
    } catch (err) {
      console.warn('Failed to sync grocery state to cloud:', err);
    }
  },

  // ---- Preferences ----
  async syncPreferencesToCloud(prefs: unknown): Promise<void> {
    const userId = getUserId();
    if (!userId) return;
    try {
      await dynamoService.savePreferences(userId, prefs);
    } catch (err) {
      console.warn('Failed to sync preferences to cloud:', err);
    }
  },

  async loadPreferencesFromCloud(): Promise<unknown | null> {
    const userId = getUserId();
    if (!userId) return null;
    try {
      return await dynamoService.getPreferences(userId);
    } catch (err) {
      console.warn('Failed to load preferences from cloud:', err);
      return null;
    }
  },

  // ---- Full sync on login ----
  async syncAllToCloud(data: {
    mealPlan?: { weekStart: string; data: unknown };
    pantry?: unknown;
    customRecipes?: Array<{ id: string; data: unknown }>;
    preferences?: unknown;
  }): Promise<void> {
    const userId = getUserId();
    if (!userId) return;

    const promises: Promise<void>[] = [];

    if (data.mealPlan) {
      promises.push(this.syncMealPlanToCloud(data.mealPlan.weekStart, data.mealPlan.data));
    }
    if (data.pantry) {
      promises.push(this.syncPantryToCloud(data.pantry));
    }
    if (data.customRecipes) {
      for (const recipe of data.customRecipes) {
        promises.push(this.syncCustomRecipeToCloud(recipe.id, recipe.data));
      }
    }
    if (data.preferences) {
      promises.push(this.syncPreferencesToCloud(data.preferences));
    }

    await Promise.allSettled(promises);
  },
};
