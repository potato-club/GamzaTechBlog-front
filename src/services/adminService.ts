import { fetchWithAuth } from '@/lib/api';
import { API_CONFIG } from '../config/api';
import { ApiResponse } from '../types/api';
import { ApproveUserResponse, PendingUser, PendingUsersResponse } from '../types/user';

export class AdminApiError extends Error {
  constructor(public status: number, message: string, public endpoint?: string) {
    super(message);
    this.name = 'AdminApiError';
  }
}

export const adminService = {
  async getPendingUsers(): Promise<PendingUsersResponse> {
    const endpoint = '/api/admin/users/pending';
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      cache: 'no-cache',
    }) as Response;

    if (!response.ok) {
      throw new AdminApiError(response.status, 'Failed to get pending users', endpoint);
    }

    const apiResponse: ApiResponse<PendingUser[]> = await response.json();
    return {
      status: apiResponse.status || 200,
      message: apiResponse.message || 'Pending users retrieved successfully',
      data: apiResponse.data,
      timestamp: Date.now()
    };
  },

  async approveUser(userId: string): Promise<ApproveUserResponse> {
    const endpoint = `/api/admin/users/${userId}/approve`;
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'PUT',
    }) as Response;

    if (!response.ok) {
      throw new AdminApiError(response.status, 'Failed to approve user', endpoint);
    }

    const apiResponse: ApiResponse<object> = await response.json();
    return {
      status: apiResponse.status || 200,
      message: apiResponse.message || 'User approved successfully',
      data: apiResponse.data,
      timestamp: Date.now()
    };
  },
};
