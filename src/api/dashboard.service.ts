import { apiClient } from './axios-instance';
import type { DashboardSummary } from '@/types/dashboard.types';

// ──────────────────────────────────────────────
// Dashboard API Service
// ──────────────────────────────────────────────

const DASHBOARD_BASE = '/dashboard';

/** Fetch the full dashboard summary (stats + recent activity) */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>(
    `${DASHBOARD_BASE}/summary`,
  );
  return data;
}
