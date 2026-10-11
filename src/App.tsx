import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { AuthGuard } from '@/auth/AuthGuard';
import { router } from '@/router/router';
import { useAppStore } from '@/store/app.store';

// ──────────────────────────────────────────────
// Query Client – shared across the app
// ──────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 1 minute default
    },
  },
});

// ──────────────────────────────────────────────
// App Root
// ──────────────────────────────────────────────

export function App() {
  const darkMode = useAppStore((s) => s.darkMode);

  return (
    <StrictMode>
      <div className={darkMode ? 'bp5-dark' : ''}>
        <QueryClientProvider client={queryClient}>
          <AuthGuard>
            <RouterProvider router={router} />
          </AuthGuard>
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        </QueryClientProvider>
      </div>
    </StrictMode>
  );
}
