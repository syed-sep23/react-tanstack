import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '@/api/dashboard.service';

// ──────────────────────────────────────────────
// Dashboard Query Hooks
// ──────────────────────────────────────────────

/** Query key factory – keeps keys consistent and type-safe */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
};

/** Fetch the dashboard summary */
export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: getDashboardSummary,
    staleTime: 1000 * 60 * 2, // consider fresh for 2 minutes
    refetchOnWindowFocus: true,
  });
}
