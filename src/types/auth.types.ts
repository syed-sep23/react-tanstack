// ──────────────────────────────────────────────
// Auth Types
// ──────────────────────────────────────────────

/** Authenticated user returned by the backend */
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  roles: string[];
  permissions: string[];
  avatarUrl?: string;
}

/** Response from getAuthenticatedUser API */
export interface AuthUserResponse {
  user: AuthUser;
}

/** Response from the SSO XHR token endpoint */
export interface SsoTokenResponse {
  token: string;
  expiresIn: number; // seconds
}

/** Auth state in the store */
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/** Auth actions exposed by the store */
export interface AuthActions {
  setUser: (user: AuthUser) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  reset: () => void;
}
