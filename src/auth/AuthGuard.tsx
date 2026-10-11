import { useEffect, type ReactNode } from 'react';
import { Spinner, NonIdealState } from '@blueprintjs/core';
import { useAuthStore } from '@/store/auth.store';
import { bootstrapAuth } from './auth.service';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Wraps the application tree and ensures the user is authenticated
 * before rendering any protected content.
 *
 * On mount it runs the SSO bootstrap flow. While that is in progress
 * a full-screen spinner is shown; if it fails the user is redirected
 * to the SSO login page (handled inside `bootstrapAuth`).
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const error = useAuthStore((s) => s.error);

  useEffect(() => {
    // Only bootstrap if we haven't resolved auth yet
    if (!isAuthenticated) {
      bootstrapAuth();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="auth-guard-loading">
        <Spinner size={60} intent="primary" />
        <p className="auth-guard-loading__text">
          Verifying your identity…
        </p>
      </div>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <div className="auth-guard-loading">
        <NonIdealState
          icon="error"
          title="Authentication Error"
          description={error}
        />
      </div>
    );
  }

  return <>{children}</>;
}
