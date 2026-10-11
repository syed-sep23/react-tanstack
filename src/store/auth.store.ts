import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser, AuthState, AuthActions } from '@/types/auth.types';

const TOKEN_STORAGE_KEY = 'ces_auth_token';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // starts as true – the auth guard will resolve this
  error: null,
};

/**
 * Auth store – persists the token to sessionStorage so it survives
 * page reloads but not new browser sessions (standard SSO behaviour).
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user: AuthUser) =>
        set({ user, isAuthenticated: true, isLoading: false, error: null }),

      setToken: (token: string) => set({ token }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setError: (error: string | null) =>
        set({ error, isLoading: false }),

      logout: () => {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        set({ ...initialState, isLoading: false });
      },

      reset: () => set(initialState),
    }),
    {
      name: TOKEN_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      // Only persist the token – the user object is fetched fresh on load
      partialize: (state) => ({ token: state.token }),
    },
  ),
);
