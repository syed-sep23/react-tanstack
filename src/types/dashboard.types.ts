// ──────────────────────────────────────────────
// Dashboard Types
// ──────────────────────────────────────────────

export interface DashboardStats {
  totalPolicies: number;
  activePolicies: number;
  pendingApprovals: number;
  expiredPolicies: number;
  totalEntitlements: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  description: string;
  user: string;
  timestamp: string;
  entityType: 'policy' | 'entitlement' | 'user';
  entityId: string;
}

export interface DashboardSummary {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
}

/** Generic paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
