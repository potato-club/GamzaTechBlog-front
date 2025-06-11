import { fetchWithAuth } from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { UserProfileData } from '@/types/user';
import { API_CONFIG } from "../config/api";

// --- 커스텀 에러 클래스 (기존과 동일) ---
export class AuthError extends Error {
  constructor(public status: number, message: string, public endpoint?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// ⭐️ 2. 기존의 apiRequest 함수는 이제 필요 없으므로 삭제합니다.

// --- Next.js에 최적화된 새로운 userService 객체 ---
export const userService = {
  /**
   * 사용자 프로필 정보를 가져옵니다.
   * @param nextOptions - Next.js fetch 캐싱 옵션
   */
  async getProfile(nextOptions?: NextFetchRequestConfig): Promise<UserProfileData> {
    const endpoint = '/api/v1/users/me/get/profile'; // 엔드포인트 명시

    // ⭐️ 3. 직접 fetchWithAuth를 호출합니다.
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, { next: nextOptions });

    // console.log('!response! :', response); // 디버깅 로그

    // const accessToken = getCookie('authorization'); // 쿠키에서 토큰을 가져옵니다.

    // console.log('!!authorization:', accessToken); // 디버깅 로그

    // const response = await fetch(API_CONFIG.BASE_URL + endpoint, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`, // 쿠키에서 토큰을 가져옵니다.
    //   },
    //   credentials: 'include', // RT 자동 전송을 위해 계속 포함
    // });

    // console.log('!!!Response!!! :', response); // 디버깅 로그


    if (!response.ok) {
      throw new AuthError(response.status, 'Failed to get user profile', endpoint);
    }

    const apiResponse: ApiResponse<UserProfileData> = await response.json();
    return apiResponse.data;
  },

  async logout(): Promise<void> {
    const endpoint = '/api/auth/me/logout';
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new AuthError(response.status, 'Failed to logout', endpoint);
    }
  },

  async updateProfile(profileData: Partial<UserProfileData>): Promise<UserProfileData> {
    const endpoint = '/api/v1/users/me/update/profile';
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new AuthError(response.status, 'Failed to update profile', endpoint);
    }

    const apiResponse: ApiResponse<UserProfileData> = await response.json();
    return apiResponse.data;
  },

  async completeProfile(profileData: UserProfileData): Promise<UserProfileData> {
    const endpoint = '/api/v1/users/me/complete/profile';
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new AuthError(response.status, 'Failed to complete profile', endpoint);
    }
    const apiResponse: ApiResponse<UserProfileData> = await response.json();
    return apiResponse.data;
  },

  async withdrawAccount(): Promise<void> {
    const endpoint = '/api/v1/users/me/withdraw';
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new AuthError(response.status, 'Failed to withdraw account', endpoint);
    }
  },
} as const;


/**
 * [추천] 서버 컴포넌트/액션 등에서 사용할 현재 사용자 정보 조회 함수입니다.
 */
export async function getCurrentUser(): Promise<UserProfileData | null> {
  try {
    // userService.getProfile이 내부적으로 fetchWithAuth를 사용하므로
    // 서버 환경에서도 인증 헤더가 자동으로 처리됩니다.
    const userProfile = await userService.getProfile({ revalidate: 0 });
    return userProfile;
  } catch (error) {
    if (error instanceof AuthError && error.status === 401) {
      return null;
    }
    console.error('Failed to get current user:', error);
    return null;
  }
}