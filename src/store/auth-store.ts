import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, type AuthTokens, type UserInfo } from '../services/auth-service';

interface AuthState {
  // State
  user: UserInfo | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signUp: (email: string, password: string, name: string) => Promise<{ needsConfirmation: boolean }>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  confirmForgotPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
  hydrateUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signUp: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          await authService.signUp(email, password, name);
          set({ isLoading: false });
          return { needsConfirmation: true };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Sign up failed';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      confirmSignUp: async (email, code) => {
        set({ isLoading: true, error: null });
        try {
          await authService.confirmSignUp(email, code);
          set({ isLoading: false });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Confirmation failed';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const tokens = await authService.signIn(email, password);
          const user = await authService.getUser(tokens.accessToken);
          set({ tokens, user, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Sign in failed';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      signOut: async () => {
        const { tokens } = get();
        set({ isLoading: true });
        try {
          if (tokens?.accessToken) {
            await authService.signOut(tokens.accessToken);
          }
        } catch {
          // Ignore errors during sign out — clear local state anyway
        }
        set({ user: null, tokens: null, isAuthenticated: false, isLoading: false, error: null });
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await authService.forgotPassword(email);
          set({ isLoading: false });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to send reset code';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      confirmForgotPassword: async (email, code, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          await authService.confirmForgotPassword(email, code, newPassword);
          set({ isLoading: false });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Password reset failed';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      refreshSession: async () => {
        const { tokens } = get();
        if (!tokens?.refreshToken) return;
        try {
          const newTokens = await authService.refreshSession(tokens.refreshToken);
          const user = await authService.getUser(newTokens.accessToken);
          set({ tokens: newTokens, user, isAuthenticated: true });
        } catch {
          // Refresh failed — force sign out
          set({ user: null, tokens: null, isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),

      hydrateUser: async () => {
        const { tokens } = get();
        if (!tokens?.accessToken) return;

        // Check if token is expired
        if (tokens.expiresAt < Date.now()) {
          // Try refresh
          await get().refreshSession();
          return;
        }

        try {
          const user = await authService.getUser(tokens.accessToken);
          set({ user, isAuthenticated: true });
        } catch {
          await get().refreshSession();
        }
      },
    }),
    {
      name: 'meal-planner-auth',
      partialize: (state) => ({
        tokens: state.tokens,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
