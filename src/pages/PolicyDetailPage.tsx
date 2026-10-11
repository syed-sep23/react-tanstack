import {
  Card,
  H3,
  Spinner,
  NonIdealState,
  Tag,
  Button,
  Tabs,
  Tab,
  HTMLTable,
  Breadcrumbs,
  type BreadcrumbProps,
  Intent,
} from '@blueprintjs/core';
import { useNavigate } from '@tanstack/react-router';
import { usePolicyDetail } from '@/hooks/usePolicy';
import { policyDetailRoute } from '@/router/router';
import type { PolicyRule, PolicyEntitlement, PolicyAuditEntry } from '@/types/policy.types';

// ──────────────────────────────────────────────
// Policy Detail Page  — /policy/:policyId
// ──────────────────────────────────────────────

export function PolicyDetailPage() {
  const navigate = useNavigate();
  const { policyId } = policyDetailRoute.useParams();
  const { data: policy, isLoading, isError, error } = usePolicyDetail(policyId);

  if (isLoading) {
    return (
      <div className="page-loader">
        <Spinner size={40} />
      </div>
    );
  }

  if (isError || !policy) {
    return (
      <NonIdealState
        icon="error"
        title="Policy not found"
        description={
          error instanceof Error
            ? error.message
            : `Could not load policy "${policyId}".`
        }
        action={
          <Button
            text="Back to Policies"
            icon="arrow-left"
            onClick={() => navigate({ to: '/policy' })}
          />
        }
      />
    );
  }

  const breadcrumbs: BreadcrumbProps[] = [
    { text: 'Policies', onClick: () => navigate({ to: '/policy' }) },
    { text: policy.name },
  ];

  const statusIntent: Intent =
    policy.status === 'active'
      ? 'success'
      : policy.status === 'expired'
        ? 'danger'
        : policy.status === 'pending'
          ? 'warning'
          : 'none';

  return (
    <div className="policy-detail-page">
      <Breadcrumbs items={breadcrumbs} className="policy-detail__breadcrumbs" />

      {/* Header */}
      <Card elevation={2} className="policy-detail__header">
        <div className="policy-detail__title-row">
          <div>
            <H3>{policy.name}</H3>
            <p className="text-muted">{policy.description}</p>
          </div>
          <div className="policy-detail__meta">
            <Tag intent={statusIntent} large round>
              {policy.status}
            </Tag>
            <Tag minimal>v{policy.version}</Tag>
          </div>
        </div>

        <div className="policy-detail__info-grid">
          <InfoItem label="Created By" value={policy.createdBy} />
          <InfoItem
            label="Created At"
            value={new Date(policy.createdAt).toLocaleDateString()}
          />
          <InfoItem
            label="Effective Date"
            value={new Date(policy.effectiveDate).toLocaleDateString()}
          />
          <InfoItem
            label="Expiration"
            value={
              policy.expirationDate
                ? new Date(policy.expirationDate).toLocaleDateString()
                : '—'
            }
          />
        </div>

        {policy.tags.length > 0 && (
          <div className="policy-detail__tags">
            {policy.tags.map((tag) => (
              <Tag key={tag} minimal round>
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </Card>

      {/* Tabs */}
      <Tabs id="policy-detail-tabs" large className="policy-detail__tabs">
        <Tab
          id="rules"
          title="Rules"
          panel={<RulesPanel rules={policy.rules} />}
        />
        <Tab
          id="entitlements"
          title="Entitlements"
          panel={<EntitlementsPanel entitlements={policy.entitlements} />}
        />
        <Tab
          id="audit"
          title="Audit Log"
          panel={<AuditPanel entries={policy.auditLog} />}
        />
      </Tabs>
    </div>
  );
}

// ──────────────────────────────────────────────
// Helper Components
// ──────────────────────────────────────────────

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-item">
      <span className="info-item__label">{label}</span>
      <span className="info-item__value">{value}</span>
    </div>
  );
}

function RulesPanel({ rules }: { rules: PolicyRule[] }) {
  if (!rules.length) {
    return <NonIdealState icon="list" title="No rules defined" />;
  }

  return (
    <HTMLTable bordered compact striped>
      <thead>
        <tr>
          <th>Priority</th>
          <th>Name</th>
          <th>Condition</th>
          <th>Effect</th>
          <th>Resources</th>
        </tr>
      </thead>
      <tbody>
        {rules.map((rule) => (
          <tr key={rule.id}>
            <td>{rule.priority}</td>
            <td>{rule.name}</td>
            <td>
              <code>{rule.condition}</code>
            </td>
            <td>
              <Tag
                intent={rule.effect === 'allow' ? 'success' : 'danger'}
                minimal
              >
                {rule.effect}
              </Tag>
            </td>
            <td>{rule.resources.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
}

function EntitlementsPanel({
  entitlements,
}: {
  entitlements: PolicyEntitlement[];
}) {
  if (!entitlements.length) {
    return <NonIdealState icon="key" title="No entitlements assigned" />;
  }

  return (
    <HTMLTable bordered compact striped>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Granted To</th>
          <th>Granted At</th>
        </tr>
      </thead>
      <tbody>
        {entitlements.map((ent) => (
          <tr key={ent.id}>
            <td>{ent.name}</td>
            <td>
              <Tag minimal>{ent.type}</Tag>
            </td>
            <td>{ent.grantedTo}</td>
            <td>{new Date(ent.grantedAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
}

function AuditPanel({ entries }: { entries: PolicyAuditEntry[] }) {
  if (!entries.length) {
    return <NonIdealState icon="history" title="No audit entries" />;
  }

  return (
    <HTMLTable bordered compact striped>
      <thead>
        <tr>
          <th>Action</th>
          <th>Performed By</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.id}>
            <td>{entry.action}</td>
            <td>{entry.performedBy}</td>
            <td>{new Date(entry.timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
}
