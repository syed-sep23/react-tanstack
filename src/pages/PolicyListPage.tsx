import { useState } from 'react';
import {
  Card,
  H3,
  Spinner,
  NonIdealState,
  HTMLTable,
  Tag,
  Button,
  ButtonGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core';
import { Outlet, useNavigate, useMatches } from '@tanstack/react-router';
import { usePolicies } from '@/hooks/usePolicy';
import type { Policy, PolicyStatus } from '@/types/policy.types';

// ──────────────────────────────────────────────
// Policy Layout (renders list or detail via Outlet)
// ──────────────────────────────────────────────

export function PolicyLayout() {
  // If a child route is active (e.g. /policy/$policyId), render its Outlet.
  // Otherwise render the policy list.
  const matches = useMatches();
  const hasChildRoute = matches.length > 2; // root + policy + child

  if (hasChildRoute) {
    return <Outlet />;
  }

  return <PolicyListPage />;
}

// ──────────────────────────────────────────────
// Policy List Page
// ──────────────────────────────────────────────

function PolicyListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error } = usePolicies({
    page,
    pageSize,
    search: search || undefined,
  });

  return (
    <div className="policy-page">
      <div className="page-header">
        <H3 className="page-title">Policies</H3>
        <Button
          icon="plus"
          intent="primary"
          text="Create Policy"
          onClick={() => navigate({ to: '/policy/$policyId', params: { policyId: 'new' } })}
        />
      </div>

      {/* Search / Filter Bar */}
      <Card elevation={1} className="policy-toolbar">
        <InputGroup
          leftIcon="search"
          placeholder="Search policies…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to first page on search
          }}
          className="policy-toolbar__search"
        />
      </Card>

      {/* Content */}
      {isLoading ? (
        <div className="page-loader">
          <Spinner size={40} />
        </div>
      ) : isError ? (
        <NonIdealState
          icon="error"
          title="Failed to load policies"
          description={
            error instanceof Error ? error.message : 'Unknown error'
          }
        />
      ) : !data?.data.length ? (
        <NonIdealState
          icon="search"
          title="No policies found"
          description="Try adjusting your search criteria."
        />
      ) : (
        <>
          <Card elevation={1}>
            <HTMLTable
              bordered
              compact
              striped
              interactive
              className="policy-table"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Version</th>
                  <th>Created By</th>
                  <th>Effective Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((policy) => (
                  <PolicyRow
                    key={policy.id}
                    policy={policy}
                    onView={() =>
                      navigate({
                        to: '/policy/$policyId',
                        params: { policyId: policy.id },
                      })
                    }
                  />
                ))}
              </tbody>
            </HTMLTable>
          </Card>

          {/* Pagination */}
          <div className="pagination">
            <ButtonGroup minimal>
              <Button
                icon="chevron-left"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              />
              <Button
                minimal
                text={`Page ${page} of ${data.totalPages}`}
                disabled
              />
              <Button
                icon="chevron-right"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              />
            </ButtonGroup>
          </div>
        </>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Policy Table Row
// ──────────────────────────────────────────────

function statusIntent(status: PolicyStatus): Intent {
  switch (status) {
    case 'active':
      return 'success';
    case 'pending':
      return 'warning';
    case 'expired':
      return 'danger';
    case 'draft':
      return 'none';
    case 'inactive':
      return 'none';
    default:
      return 'none';
  }
}

interface PolicyRowProps {
  policy: Policy;
  onView: () => void;
}

function PolicyRow({ policy, onView }: PolicyRowProps) {
  return (
    <tr>
      <td>
        <strong>{policy.name}</strong>
        <br />
        <span className="text-muted">{policy.description}</span>
      </td>
      <td>
        <Tag intent={statusIntent(policy.status)} minimal round>
          {policy.status}
        </Tag>
      </td>
      <td>v{policy.version}</td>
      <td>{policy.createdBy}</td>
      <td>{new Date(policy.effectiveDate).toLocaleDateString()}</td>
      <td>
        <Button
          icon="eye-open"
          small
          minimal
          intent="primary"
          onClick={onView}
          aria-label={`View policy ${policy.name}`}
        />
      </td>
    </tr>
  );
}
