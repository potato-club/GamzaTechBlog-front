import { PendingUserResponse } from "@/generated/api/models";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { approveUserAction } from "../actions/adminActions";
import { approveUserAction } from "../actions/adminActions";
import { adminService } from "../services/adminService";
import type { ActionResult } from "@/lib/actionResult";

export const ADMIN_QUERY_KEYS = {
  all: ["admin"] as const,
  pendingUsers: () => [...ADMIN_QUERY_KEYS.all, "pendingUsers"] as const,
};

export function usePendingUsers(
  options?: Omit<UseQueryOptions<PendingUserResponse[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.pendingUsers(),
    queryFn: () => adminService.getPendingUsers(),
    ...options,
  });
}

export function useApproveUser() {
  const queryClient = useQueryClient();

  return useMutation<ActionResult<void>, Error, number>({
    mutationFn: (userId: number) => approveUserAction(userId),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.pendingUsers() });
      }
    },
  });
}
