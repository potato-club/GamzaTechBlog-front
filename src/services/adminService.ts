import { fetchWithAuth } from "@/lib/api";
import { API_CONFIG } from "@/config/api";
import { API_PATHS } from "@/constants/apiPaths";
import { ResponseDto, UserProfileResponse } from "@/generated/api";

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
  async getPendingUsers(): Promise<UserProfileResponse[]> {
    const endpoint = API_PATHS.admin.pendingUsers;

    try {
      const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
        cache: "no-cache",
      })) as Response;

      if (!response.ok) {
        throw new AdminApiError(response.status, "Failed to get pending users", endpoint);
      }

      const apiResponse: ResponseDto = await response.json();
      return (apiResponse.data as UserProfileResponse[]) || [];
    } catch (error) {
      if (error instanceof AdminApiError) throw error;
      throw new AdminApiError(
        500,
        (error as Error).message || "An unexpected error occurred",
        endpoint
      );
    }
  },

  async approveUser(userId: string): Promise<UserProfileResponse> {
    const endpoint = API_PATHS.admin.approveUser(userId);

    try {
      const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
        method: "PUT",
      })) as Response;

      if (!response.ok) {
        throw new AdminApiError(response.status, "Failed to approve user", endpoint);
      }

      const apiResponse: ResponseDto = await response.json();
      if (!apiResponse.data) {
        throw new AdminApiError(
          response.status,
          "Approve user response did not contain user data",
          endpoint
        );
      }
      return apiResponse.data as UserProfileResponse;
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
