import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  GlobalSignOutCommand,
  type AuthenticationResultType,
} from '@aws-sdk/client-cognito-identity-provider';
import { awsConfig } from './aws-config';

const client = new CognitoIdentityProviderClient({
  region: awsConfig.region,
});

const CLIENT_ID = awsConfig.cognito.clientId;

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface UserInfo {
  userId: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

function toAuthTokens(result: AuthenticationResultType): AuthTokens {
  return {
    accessToken: result.AccessToken!,
    idToken: result.IdToken!,
    refreshToken: result.RefreshToken!,
    expiresAt: Date.now() + (result.ExpiresIn ?? 3600) * 1000,
  };
}

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<{ userSub: string }> {
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
      ],
    });
    const response = await client.send(command);
    return { userSub: response.UserSub! };
  },

  async confirmSignUp(email: string, code: string): Promise<void> {
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    });
    await client.send(command);
  },

  async signIn(email: string, password: string): Promise<AuthTokens> {
    const command = new InitiateAuthCommand({
      ClientId: CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });
    const response = await client.send(command);
    return toAuthTokens(response.AuthenticationResult!);
  },

  async refreshSession(refreshToken: string): Promise<AuthTokens> {
    const command = new InitiateAuthCommand({
      ClientId: CLIENT_ID,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });
    const response = await client.send(command);
    return {
      ...toAuthTokens(response.AuthenticationResult!),
      refreshToken, // refresh token stays the same
    };
  },

  async getUser(accessToken: string): Promise<UserInfo> {
    const command = new GetUserCommand({ AccessToken: accessToken });
    const response = await client.send(command);
    const attrs = response.UserAttributes ?? [];
    const get = (name: string) => attrs.find(a => a.Name === name)?.Value ?? '';
    return {
      userId: get('sub'),
      email: get('email'),
      name: get('name'),
      emailVerified: get('email_verified') === 'true',
    };
  },

  async signOut(accessToken: string): Promise<void> {
    const command = new GlobalSignOutCommand({ AccessToken: accessToken });
    await client.send(command);
  },

  async forgotPassword(email: string): Promise<void> {
    const command = new ForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: email,
    });
    await client.send(command);
  },

  async confirmForgotPassword(email: string, code: string, newPassword: string): Promise<void> {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    });
    await client.send(command);
  },
};
