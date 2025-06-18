import { fetchWithAuth } from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { UserActivityStats, UserProfileData } from '@/types/user'; // UserActivityStats 타입 추가
import { API_CONFIG } from "../config/api";

// --- 커스텀 에러 클래스 (기존과 동일) ---
export class AuthError extends Error {
  constructor(public status: number, message: string, public endpoint?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const userService = {
  /**
   * 사용자 프로필 정보를 가져옵니다.
   * @param nextOptions - Next.js fetch 캐싱 옵션
   */
  async getProfile(nextOptions?: NextFetchRequestConfig): Promise<UserProfileData> {
    const endpoint = '/api/v1/users/me/get/profile'; // 엔드포인트 명시

    // ⭐️ 3. 직접 fetchWithAuth를 호출합니다.
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, { next: nextOptions }) as Response;

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
    }) as Response;

    if (!response.ok) {
      throw new AuthError(response.status, 'Failed to logout', endpoint);
    }
  },

  async updateProfileInSignup(profileData: Partial<UserProfileData>): Promise<UserProfileData> {
    const endpoint = '/api/v1/users/me/complete';
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'POST',
      body: JSON.stringify(profileData),
    }) as Response;

    if (!response.ok) {
      throw new AuthError(response.status, 'Failed to update profile in signup', endpoint);
    }

    const apiResponse: ApiResponse<UserProfileData> = await response.json();
    return apiResponse.data;
  },

  async completeProfile(profileData: UserProfileData): Promise<UserProfileData> {
    const endpoint = '/api/v1/users/me/complete/profile';
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'POST',
      body: JSON.stringify(profileData),
    }) as Response;

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
    }) as Response;

    if (!response.ok) {
      throw new AuthError(response.status, 'Failed to withdraw account', endpoint);
    }
  },

  /**
   * 사용자 활동 통계(작성 게시글 수, 댓글 수, 좋아요 수)를 가져옵니다.
   * @param nextOptions - Next.js fetch 캐싱 옵션
   */
  async getActivityCounts(nextOptions?: NextFetchRequestConfig): Promise<UserActivityStats> {
    const endpoint = '/api/v1/users/me/activity'; // 실제 엔드포인트로 변경 필요
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'GET', // GET 요청으로 가정
      next: nextOptions,
    }) as Response;

    if (!response.ok) {
      throw new AuthError(response.status, 'Failed to get user activity stats', endpoint);
    }

    const apiResponse: ApiResponse<UserActivityStats> = await response.json();
    return apiResponse.data;
  },

  /**
 * 사용자의 현재 역할만 가져옵니다.
 * @param nextOptions - Next.js fetch 캐싱 옵션
 * @returns 사용자의 역할 문자열 ('PRE_REGISTER', 'USER', 'ADMIN' 등) 또는 인증되지 않은 경우 null
 */
  async getUserRole(nextOptions?: NextFetchRequestConfig): Promise<string | null> {
    const endpoint = '/api/v1/users/me/role'; // 실제 백엔드 엔드포인트로 변경 필요
    try {
      const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
        method: 'GET',
        next: nextOptions,
      }) as Response;

      if (response.status === 401) {
        // 인증되지 않은 상태
        return null;
      }

      // 200 OK 외의 다른 에러 상태 코드 처리
      if (!response.ok) {
        throw new AuthError(response.status, 'Failed to get user role', endpoint);
      }

      const apiResponse: ApiResponse<string> = await response.json();
      return apiResponse.data;
    } catch (error) {
      // fetchWithAuth 자체에서 발생한 에러 (네트워크 등)
      console.error('Error fetching user role:', error);
      throw error; // 에러를 다시 던져서 useQuery가 처리하도록 함
    }
  },

  // /**
  //  * 사용자 프로필을 업데이트합니다.
  //  * @param profileData - 업데이트할 프로필 데이터
  //  * @returns 업데이트된 사용자 프로필 데이터
  //  */
  // async updateProfile(profileData: Partial<UserProfileData>): Promise<UserProfileData> {
  //   const endpoint = '/api/v1/users/me/update/profile';
  //   const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
  //     method: 'PUT',
  //     body: JSON.stringify(profileData),
  //   }) as Response;

  //   if (!response.ok) {
  //     throw new AuthError(response.status, 'Failed to update profile', endpoint);
  //   }

  //   const apiResponse: ApiResponse<UserProfileData> = await response.json();
  //   return apiResponse.data;
  // },

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