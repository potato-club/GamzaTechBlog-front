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

// 공통 API 요청 함수 (getProfile, logout 등에서 계속 사용)
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...API_CONFIG.REQUEST_CONFIG, // credentials: 'include' 등 기본 설정 포함 가정
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 401) {
    // AuthError를 throw하면 React Query의 useQuery에서 error로 잡힘
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
  async getProfile(): Promise<UserProfileData> {
    const response = await apiRequest<ApiResponse<UserProfileData>>(
      API_CONFIG.ENDPOINTS.USER.PROFILE
    );
    return response.data;
  },

  async logout(): Promise<void> {
    // 로그아웃은 성공/실패 여부만 중요하고, 실패 시 apiRequest가 에러를 throw 할 것임
    await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST'
    });
  },

  // 수정된 checkAuthStatus 함수
  async checkAuthStatus(): Promise<AuthResponse> {
    try {
      // API_CONFIG.REQUEST_CONFIG에 credentials: 'include'가 있다고 가정
      // 또는 여기서 명시적으로 추가:
      // const requestOptions = {
      //   ...API_CONFIG.REQUEST_CONFIG,
      //   credentials: API_CONFIG.REQUEST_CONFIG.credentials || 'include',
      // };
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER.PROFILE}`, API_CONFIG.REQUEST_CONFIG);

      if (response.ok) { // 200-299 상태 코드 (성공)
        const apiResponse: ApiResponse<UserProfileData> = await response.json();
        return { isAuthenticated: true, user: apiResponse.data };
      } else if (response.status === 401) { // 401 Unauthorized (인증되지 않음)
        console.log('checkAuthStatus: User is not authenticated (401).');
        return { isAuthenticated: false, user: null };
      } else { // 그 외의 에러 상태 코드 (예: 403 Forbidden, 500 Internal Server Error 등)
        // 이 경우, React Query의 useQuery는 error 상태가 되지 않고,
        // { isAuthenticated: false, user: null } 데이터를 받게 됨.
        // 만약 useQuery에서 error 상태로 만들고 싶다면 여기서 에러를 throw 해야 함.
        // 하지만 현재 useAuth 훅은 AuthResponse를 기대하므로, 이대로 반환.
        console.error(`checkAuthStatus: Auth check failed with status: ${response.status}`);
        return { isAuthenticated: false, user: null };
      }
    } catch (error) {
      // 네트워크 에러 (fetch 자체가 실패한 경우) 또는 JSON 파싱 에러 등
      // 이 경우도 React Query의 useQuery는 error 상태가 되지 않고,
      // { isAuthenticated: false, user: null } 데이터를 받게 됨.
      // useQuery에서 error 상태로 만들고 싶다면 여기서 에러를 throw 해야 함.
      console.error('Error in userService.checkAuthStatus (network or parsing error):', error);
      return { isAuthenticated: false, user: null };
    }
  },

  async updateProfile(profileData: Partial<UserProfileData>): Promise<UserProfileData> { // Partial로 변경
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