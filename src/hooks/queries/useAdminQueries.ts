import { PendingUserResponse } from "@/generated/api/models";
import { adminService } from "@/services/adminService";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";

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

  return useMutation<void, Error, number>({
    mutationFn: (userId: number) => adminService.approveUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.pendingUsers() });
    },
  });
}
