import { adminService } from "@/services/adminService";
import { ResponseDto, UserProfileResponse } from "@/generated/api";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";

export const ADMIN_QUERY_KEYS = {
  all: ["admin"] as const,
  pendingUsers: () => [...ADMIN_QUERY_KEYS.all, "pendingUsers"] as const,
};

export function usePendingUsers(
  options?: Omit<UseQueryOptions<UserProfileResponse[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.pendingUsers(),
    queryFn: () => adminService.getPendingUsers(),
    ...options,
  });
}

export function useApproveUser() {
  const queryClient = useQueryClient();

  return useMutation<UserProfileResponse, Error, string>({
    mutationFn: (userId: string) => adminService.approveUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.pendingUsers() });
    },
  });
}
