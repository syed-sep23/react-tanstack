import { apiClient } from './axios-instance';
import type {
  Policy,
  PolicyDetail,
  PolicyListParams,
  PolicyPayload,
} from '@/types/policy.types';
import type { PaginatedResponse } from '@/types/dashboard.types';

// ──────────────────────────────────────────────
// Policy API Service
// ──────────────────────────────────────────────

const POLICY_BASE = '/policies';

/** Fetch a paginated, filtered list of policies */
export async function getPolicies(
  params?: PolicyListParams,
): Promise<PaginatedResponse<Policy>> {
  const { data } = await apiClient.get<PaginatedResponse<Policy>>(
    POLICY_BASE,
    { params },
  );
  return data;
}

/** Fetch a single policy by its ID (includes rules, entitlements, audit log) */
export async function getPolicyById(
  policyId: string,
): Promise<PolicyDetail> {
  const { data } = await apiClient.get<PolicyDetail>(
    `${POLICY_BASE}/${policyId}`,
  );
  return data;
}

/** Create a new policy */
export async function createPolicy(
  payload: PolicyPayload,
): Promise<Policy> {
  const { data } = await apiClient.post<Policy>(POLICY_BASE, payload);
  return data;
}

/** Update an existing policy */
export async function updatePolicy(
  policyId: string,
  payload: Partial<PolicyPayload>,
): Promise<Policy> {
  const { data } = await apiClient.put<Policy>(
    `${POLICY_BASE}/${policyId}`,
    payload,
  );
  return data;
}

/** Delete a policy */
export async function deletePolicy(policyId: string): Promise<void> {
  await apiClient.delete(`${POLICY_BASE}/${policyId}`);
}
