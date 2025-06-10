import { API_CONFIG } from '@/config/api';
import type { ApiResponse } from '@/types/api';
import type { AuthResponse } from '@/types/auth';
import type { UserProfileData } from '@/types/user';

// 커스텀 에러 클래스
export class AuthError extends Error {
  constructor(public status: number, message: string, public endpoint?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// 공통 API 요청 함수
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...API_CONFIG.REQUEST_CONFIG,
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 401) {
    throw new AuthError(401, 'Authentication required', endpoint);
  }

  if (!response.ok) {
    throw new AuthError(
      response.status,
      `API Error: ${response.status} - ${endpoint}`,
      endpoint
    );
  }

  return response.json();
}

export const userService = {
  async loginWithGithub(): Promise<UserProfileData> {
    const response = await apiRequest<ApiResponse<UserProfileData>>(
      "/login/oauth2/code/github",
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
  async getProfile(): Promise<UserProfileData> {
    const response = await apiRequest<ApiResponse<UserProfileData>>(
      API_CONFIG.ENDPOINTS.USER.PROFILE
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST'
    });
  },

  async checkAuthStatus(): Promise<AuthResponse> {
    try {
      const user = await this.getProfile();
      return { isAuthenticated: true, user };
    } catch (error) {
      if (error instanceof AuthError && error.status === 401) {
        return { isAuthenticated: false, user: null };
      }
      throw error;
    }
  },

  async updateProfile(profileData: UserProfileData): Promise<UserProfileData> {
    const response = await apiRequest<ApiResponse<UserProfileData>>(
      API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE,
      {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }
    );
    return response.data;
  },

  async completeProfile(profileData: UserProfileData): Promise<UserProfileData> {
    const response = await apiRequest<ApiResponse<UserProfileData>>(
      API_CONFIG.ENDPOINTS.USER.COMPLETE_PROFILE,
      {
        method: 'POST',
        body: JSON.stringify(profileData),
      }
    );
    return response.data;
  },

  async withdrawAccount(): Promise<void> {
    await apiRequest(API_CONFIG.ENDPOINTS.USER.WITHDRAW, {
      method: 'DELETE'
    });
  },
} as const;