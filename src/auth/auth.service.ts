import { apiClient, refreshTokenViaSso, redirectToSsoLogin } from '@/api/axios-instance';
import { useAuthStore } from '@/store/auth.store';
import type { AuthUserResponse } from '@/types/auth.types';

// ──────────────────────────────────────────────
// Auth Service
// ──────────────────────────────────────────────

/**
 * Attempt to retrieve the currently authenticated user from the backend.
 * Called during app boot inside the AuthGuard.
 */
export async function getAuthenticatedUser(): Promise<AuthUserResponse> {
  const { data } = await apiClient.get<AuthUserResponse>('/auth/me');
  return data;
}

/**
 * Full SSO bootstrap flow:
 *
 * 1. Try `getAuthenticatedUser` with the existing token (if any).
 * 2. If that fails (401), call the SSO XHR URL to silently fetch a new token.
 * 3. Retry `getAuthenticatedUser` with the fresh token.
 * 4. If that also fails, redirect to the SSO login page.
 */
export async function bootstrapAuth(): Promise<void> {
  const { setUser, setToken, setLoading, setError } =
    useAuthStore.getState();

  setLoading(true);

  try {
    // Step 1 – try with current token (may be null on first visit)
    const { user } = await getAuthenticatedUser();
    setUser(user);
    return;
  } catch {
    // Token missing or expired – try silent SSO
  }

  try {
    // Step 2 – obtain a fresh token via the SSO XHR endpoint
    const token = await refreshTokenViaSso();
    setToken(token);

    // Step 3 – retry the authenticated-user call
    const { user } = await getAuthenticatedUser();
    setUser(user);
  } catch {
    // Step 4 – nothing worked; redirect to SSO login
    setError('Authentication failed. Redirecting to login…');
    redirectToSsoLogin();
  }
}
