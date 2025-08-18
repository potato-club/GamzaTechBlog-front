import { PendingUserResponse } from "@/generated/api/models";
import { apiClient } from "@/lib/apiClient";

export const adminService = {
  async getPendingUsers(): Promise<PendingUserResponse[]> {
    const response = await apiClient.getPendingUsers();
    return (response.data as PendingUserResponse[]) || [];
  },

  async approveUser(userId: number): Promise<void> {
    await apiClient.approveUserProfile({ id: userId });
  },
};
