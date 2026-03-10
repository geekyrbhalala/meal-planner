// AWS Configuration
// These values should be set via environment variables (VITE_ prefix for Vite)
export const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  cognito: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
  },
  dynamodb: {
    tableName: import.meta.env.VITE_DYNAMODB_TABLE_NAME || 'MealPlannerUserData',
  },
};
