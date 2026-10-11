import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';

// ──────────────────────────────────────────────
// Axios Instance
// ──────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // send cookies for SSO flows that rely on them
});

// ──────────────────────────────────────────────
// Request Interceptor – attach Bearer token
// ──────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ──────────────────────────────────────────────
// Response Interceptor – handle 401 globally
// ──────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If we get a 401 and haven't retried yet, attempt token refresh via SSO XHR
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshTokenViaSso();
        useAuthStore.getState().setToken(newToken);

        // Retry the original request with the fresh token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        // Token refresh also failed → force full SSO login redirect
        useAuthStore.getState().logout();
        redirectToSsoLogin();
      }
    }

    return Promise.reject(error);
  },
);

// ──────────────────────────────────────────────
// SSO Helpers
// ──────────────────────────────────────────────

/**
 * Perform an XHR call to the SSO token endpoint to obtain a fresh
 * access token (e.g. via an existing SSO session cookie).
 */
export async function refreshTokenViaSso(): Promise<string> {
  const SSO_XHR_URL =
    import.meta.env.VITE_SSO_XHR_URL || '/auth/sso/token';

  const { data } = await axios.get<{ token: string }>(SSO_XHR_URL, {
    withCredentials: true,
  });

  return data.token;
}

/**
 * Hard-redirect the browser to the SSO login page when there is
 * no existing session to recover from.
 */
export function redirectToSsoLogin(): void {
  const SSO_LOGIN_URL =
    import.meta.env.VITE_SSO_LOGIN_URL || '/auth/sso/login';

  // Pass the current URL so the SSO provider redirects back after login
  const returnUrl = encodeURIComponent(window.location.href);
  window.location.href = `${SSO_LOGIN_URL}?returnUrl=${returnUrl}`;
}
