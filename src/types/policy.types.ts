// ──────────────────────────────────────────────
// Policy Types
// ──────────────────────────────────────────────

export type PolicyStatus = 'active' | 'inactive' | 'pending' | 'expired' | 'draft';

export interface Policy {
  id: string;
  name: string;
  description: string;
  status: PolicyStatus;
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  effectiveDate: string;
  expirationDate?: string;
  tags: string[];
}

export interface PolicyDetail extends Policy {
  rules: PolicyRule[];
  entitlements: PolicyEntitlement[];
  auditLog: PolicyAuditEntry[];
}

export interface PolicyRule {
  id: string;
  name: string;
  condition: string;
  effect: 'allow' | 'deny';
  priority: number;
  resources: string[];
}

export interface PolicyEntitlement {
  id: string;
  name: string;
  type: string;
  grantedTo: string;
  grantedAt: string;
}

export interface PolicyAuditEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  changes: Record<string, unknown>;
}

/** Query params for fetching the policy list */
export interface PolicyListParams {
  page?: number;
  pageSize?: number;
  status?: PolicyStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Payload for creating / updating a policy */
export interface PolicyPayload {
  name: string;
  description: string;
  status: PolicyStatus;
  effectiveDate: string;
  expirationDate?: string;
  tags: string[];
  rules: Omit<PolicyRule, 'id'>[];
}
