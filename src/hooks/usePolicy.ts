import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
} from '@/api/policy.service';
import type { PolicyListParams, PolicyPayload } from '@/types/policy.types';

// ──────────────────────────────────────────────
// Policy Query Hooks
// ──────────────────────────────────────────────

/** Query key factory */
export const policyKeys = {
  all: ['policies'] as const,
  lists: () => [...policyKeys.all, 'list'] as const,
  list: (params?: PolicyListParams) =>
    [...policyKeys.lists(), params] as const,
  details: () => [...policyKeys.all, 'detail'] as const,
  detail: (id: string) => [...policyKeys.details(), id] as const,
};

/** Paginated policy list */
export function usePolicies(params?: PolicyListParams) {
  return useQuery({
    queryKey: policyKeys.list(params),
    queryFn: () => getPolicies(params),
    staleTime: 1000 * 60,
  });
}

/** Single policy detail */
export function usePolicyDetail(policyId: string) {
  return useQuery({
    queryKey: policyKeys.detail(policyId),
    queryFn: () => getPolicyById(policyId),
    enabled: !!policyId,
  });
}

/** Create a new policy */
export function useCreatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PolicyPayload) => createPolicy(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
    },
  });
}

/** Update an existing policy */
export function useUpdatePolicy(policyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<PolicyPayload>) =>
      updatePolicy(policyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: policyKeys.detail(policyId),
      });
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
    },
  });
}

/** Delete a policy */
export function useDeletePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (policyId: string) => deletePolicy(policyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
    },
  });
}
