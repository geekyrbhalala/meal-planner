import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { awsConfig } from './aws-config';

const rawClient = new DynamoDBClient({ region: awsConfig.region });
const docClient = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: { removeUndefinedValues: true },
});

const TABLE = awsConfig.dynamodb.tableName;

// Table schema:
// PK: USER#<userId>
// SK: <entityType>#<entityId>
// Entity types: PROFILE, MEALPLAN#<weekStart>, PANTRY, CUSTOM_RECIPE#<id>, PREFERENCES

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  familySize: number;
  createdAt: string;
  updatedAt: string;
}

export const dynamoService = {
  // ---- User Profile ----
  async getProfile(userId: string): Promise<UserProfile | null> {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: 'PROFILE' },
    }));
    return (result.Item as UserProfile) ?? null;
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    await docClient.send(new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `USER#${profile.userId}`,
        SK: 'PROFILE',
        ...profile,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  // ---- Meal Plans ----
  async saveMealPlan(userId: string, weekStart: string, planData: unknown): Promise<void> {
    await docClient.send(new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `USER#${userId}`,
        SK: `MEALPLAN#${weekStart}`,
        data: planData,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  async getMealPlan(userId: string, weekStart: string): Promise<unknown | null> {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: `MEALPLAN#${weekStart}` },
    }));
    return result.Item?.data ?? null;
  },

  async listMealPlans(userId: string): Promise<Array<{ weekStart: string; data: unknown }>> {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': 'MEALPLAN#',
      },
      ScanIndexForward: false,
    }));
    return (result.Items ?? []).map(item => ({
      weekStart: (item.SK as string).replace('MEALPLAN#', ''),
      data: item.data,
    }));
  },

  // ---- Pantry ----
  async savePantry(userId: string, pantryData: unknown): Promise<void> {
    await docClient.send(new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `USER#${userId}`,
        SK: 'PANTRY',
        data: pantryData,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  async getPantry(userId: string): Promise<unknown | null> {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: 'PANTRY' },
    }));
    return result.Item?.data ?? null;
  },

  // ---- Custom Recipes ----
  async saveCustomRecipe(userId: string, recipeId: string, recipeData: unknown): Promise<void> {
    await docClient.send(new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `USER#${userId}`,
        SK: `CUSTOM_RECIPE#${recipeId}`,
        data: recipeData,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  async deleteCustomRecipe(userId: string, recipeId: string): Promise<void> {
    await docClient.send(new DeleteCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: `CUSTOM_RECIPE#${recipeId}` },
    }));
  },

  async listCustomRecipes(userId: string): Promise<unknown[]> {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': 'CUSTOM_RECIPE#',
      },
    }));
    return (result.Items ?? []).map(item => item.data);
  },

  // ---- Preferences (grocery checked items, settings, etc.) ----
  async savePreferences(userId: string, prefs: unknown): Promise<void> {
    await docClient.send(new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `USER#${userId}`,
        SK: 'PREFERENCES',
        data: prefs,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  async getPreferences(userId: string): Promise<unknown | null> {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: 'PREFERENCES' },
    }));
    return result.Item?.data ?? null;
  },

  // ---- Grocery List (checked state) ----
  async saveGroceryState(userId: string, weekStart: string, groceryData: unknown): Promise<void> {
    await docClient.send(new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `USER#${userId}`,
        SK: `GROCERY#${weekStart}`,
        data: groceryData,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  async getGroceryState(userId: string, weekStart: string): Promise<unknown | null> {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: `GROCERY#${weekStart}` },
    }));
    return result.Item?.data ?? null;
  },
};
