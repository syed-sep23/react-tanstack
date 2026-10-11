import {
  Card,
  H3,
  H5,
  Spinner,
  NonIdealState,
  Tag,
  Icon,
  HTMLTable,
} from '@blueprintjs/core';
import { useDashboardSummary } from '@/hooks/useDashboard';
import type { DashboardStats, RecentActivity } from '@/types/dashboard.types';

// ──────────────────────────────────────────────
// Dashboard Page
// ──────────────────────────────────────────────

export function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="page-loader">
        <Spinner size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <NonIdealState
        icon="error"
        title="Failed to load dashboard"
        description={
          error instanceof Error ? error.message : 'Unknown error'
        }
      />
    );
  }

  return (
    <div className="dashboard-page">
      <H3 className="page-title">Dashboard</H3>

      {data && (
        <>
          <StatsGrid stats={data.stats} />
          <RecentActivityTable activities={data.recentActivities} />
        </>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Stats Cards
// ──────────────────────────────────────────────

interface StatsGridProps {
  stats: DashboardStats;
}

function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    {
      label: 'Total Policies',
      value: stats.totalPolicies,
      icon: 'shield' as const,
      intent: 'primary' as const,
    },
    {
      label: 'Active',
      value: stats.activePolicies,
      icon: 'tick-circle' as const,
      intent: 'success' as const,
    },
    {
      label: 'Pending Approval',
      value: stats.pendingApprovals,
      icon: 'time' as const,
      intent: 'warning' as const,
    },
    {
      label: 'Expired',
      value: stats.expiredPolicies,
      icon: 'disable' as const,
      intent: 'danger' as const,
    },
    {
      label: 'Entitlements',
      value: stats.totalEntitlements,
      icon: 'key' as const,
      intent: 'none' as const,
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <Card key={card.label} className="stats-card" elevation={2}>
          <div className="stats-card__icon">
            <Icon icon={card.icon} size={24} intent={card.intent} />
          </div>
          <div className="stats-card__body">
            <span className="stats-card__value">{card.value}</span>
            <span className="stats-card__label">{card.label}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────
// Recent Activity Table
// ──────────────────────────────────────────────

interface RecentActivityTableProps {
  activities: RecentActivity[];
}

function RecentActivityTable({ activities }: RecentActivityTableProps) {
  if (!activities.length) {
    return (
      <Card elevation={1} className="activity-card">
        <NonIdealState icon="history" title="No recent activity" />
      </Card>
    );
  }

  return (
    <Card elevation={1} className="activity-card">
      <H5>Recent Activity</H5>
      <HTMLTable bordered compact striped className="activity-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Description</th>
            <th>User</th>
            <th>Type</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td>{activity.action}</td>
              <td>{activity.description}</td>
              <td>{activity.user}</td>
              <td>
                <Tag minimal intent="primary">
                  {activity.entityType}
                </Tag>
              </td>
              <td>{new Date(activity.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
    </Card>
  );
}
