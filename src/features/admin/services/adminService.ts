import { API_CONFIG } from "@/config/api";
import { API_PATHS } from "@/constants/apiPaths";
import { PendingUserResponse, ResponseDtoListPendingUserResponse } from "@/generated/api/models";
import { fetchWithAuth } from "@/lib/api";

export class AdminApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public endpoint?: string
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

export const adminService = {
  async getPendingUsers(): Promise<PendingUserResponse[]> {
    const endpoint = API_PATHS.admin.pendingUsers;

    try {
      const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
        cache: "no-cache",
      })) as Response;

      if (!response.ok) {
        throw new AdminApiError(response.status, "Failed to get pending users", endpoint);
      }

      const apiResponse: ResponseDtoListPendingUserResponse = await response.json();
      return (apiResponse.data as PendingUserResponse[]) || [];
    } catch (error) {
      if (error instanceof AdminApiError) throw error;
      throw new AdminApiError(
        500,
        (error as Error).message || "An unexpected error occurred",
        endpoint
      );
    }
  },

  async approveUser(userId: number): Promise<void> {
    const endpoint = API_PATHS.admin.approveUser(userId);

    try {
      const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
        method: "PUT",
      })) as Response;

      if (!response.ok) {
        throw new AdminApiError(response.status, "Failed to approve user", endpoint);
      }
    } catch (error) {
      if (error instanceof AdminApiError) throw error;
      throw new AdminApiError(
        500,
        (error as Error).message || "An unexpected error occurred",
        endpoint
      );
    }
  },
};
