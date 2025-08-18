import { API_CONFIG } from "@/config/api";
import { API_PATHS } from "@/constants/apiPaths";
import type {
  ResponseDtoString,
  ResponseDtoUserActivityResponse,
  ResponseDtoUserProfileResponse,
  UpdateProfileRequest,
  UserActivityResponse,
  UserProfileRequest,
  UserProfileResponse,
} from "@/generated/api";
import { fetchWithAuth } from "@/lib/api";

// --- 커스텀 에러 클래스 (기존과 동일) ---
export class AuthError extends Error {
  constructor(
    public status: number,
    message: string,
    public endpoint?: string
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export const userService = {
  /**
   * 사용자 프로필 정보를 가져옵니다.
   * TanStack Query에서 캐싱을 담당하므로 fetch 레벨에서는 캐싱하지 않습니다.
   */
  async getProfile(): Promise<UserProfileResponse> {
    const endpoint = API_PATHS.users.profile;

    try {
      const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
        cache: "no-cache", // TanStack Query가 캐싱을 담당하므로 fetch 캐싱 비활성화
      })) as Response;

      if (!response.ok) {
        throw new AuthError(response.status, "Failed to get user profile", endpoint);
      }

      const apiResponse: ResponseDtoUserProfileResponse = await response.json();
      return apiResponse.data as UserProfileResponse;
    } catch (error) {
      // RefreshTokenInvalidError는 다시 던져서 상위에서 처리하도록 함
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "RefreshTokenInvalidError"
      ) {
        throw error;
      }

      // 기타 에러도 다시 던짐
      throw error;
    }
  },

  /**
   * 로그아웃을 수행합니다.
   * POST 뮤테이션 작업이므로 캐싱하지 않습니다.
   */
  async logout(): Promise<void> {
    const endpoint = API_PATHS.users.logout;
    const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: "POST",
    })) as Response;

    if (!response.ok) {
      throw new AuthError(response.status, "Failed to logout", endpoint);
    }
  },

  /**
   * 회원가입 중 프로필 정보를 업데이트합니다.
   * POST 뮤테이션 작업이므로 캐싱하지 않습니다.
   */
  async updateProfileInSignup(profileData: UserProfileRequest): Promise<UserProfileResponse> {
    const endpoint = API_PATHS.users.completeSignup;
    const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: "POST",
      body: JSON.stringify(profileData),
    })) as Response;

    if (!response.ok) {
      throw new AuthError(response.status, "Failed to update profile in signup", endpoint);
    }

    const apiResponse: ResponseDtoUserProfileResponse = await response.json();
    return apiResponse.data as UserProfileResponse;
  },

  /**
   * 계정 탈퇴를 수행합니다.
   * DELETE 뮤테이션 작업이므로 캐싱하지 않습니다.
   */
  async withdrawAccount(): Promise<void> {
    const endpoint = API_PATHS.users.withdraw;
    const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: "DELETE",
    })) as Response;

    if (!response.ok) {
      throw new AuthError(response.status, "Failed to withdraw account", endpoint);
    }
  },

  /**
   * 사용자 활동 통계(작성 게시글 수, 댓글 수, 좋아요 수)를 가져옵니다.
   * TanStack Query에서 캐싱을 담당하므로 fetch 레벨에서는 캐싱하지 않습니다.
   */
  async getActivityCounts(): Promise<UserActivityResponse> {
    const endpoint = API_PATHS.users.activity;
    const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: "GET",
      cache: "no-cache", // TanStack Query가 캐싱을 담당하므로 fetch 캐싱 비활성화
    })) as Response;
    if (!response.ok) {
      throw new AuthError(response.status, "Failed to get user activity stats", endpoint);
    }

    const apiResponse: ResponseDtoUserActivityResponse = await response.json();
    return apiResponse.data as UserActivityResponse;
  },

  /**
   * 사용자의 현재 역할만 가져옵니다.
   * TanStack Query에서 캐싱을 담당하므로 fetch 레벨에서는 캐싱하지 않습니다.
   * @returns 사용자의 역할 문자열 ('PRE_REGISTER', 'USER', 'ADMIN' 등) 또는 인증되지 않은 경우 null
   */
  async getUserRole(): Promise<string | null> {
    const endpoint = API_PATHS.users.role;
    try {
      const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
        method: "GET",
        cache: "no-cache", // TanStack Query가 캐싱을 담당하므로 fetch 캐싱 비활성화
      })) as Response;

      if (response.status === 401 || response.status === 403) {
        // 인증되지 않은 상태 또는 토큰 만료
        return null;
      }

      if (!response.ok) {
        throw new AuthError(response.status, "Failed to get user role", endpoint);
      }

      const apiResponse: ResponseDtoString = await response.json();
      return apiResponse.data as string;
    } catch (error) {
      // RefreshTokenInvalidError는 로그아웃이 필요한 상태이므로 null 반환
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "RefreshTokenInvalidError"
      ) {
        console.warn("Refresh token invalid, user needs to login again");
        return null;
      }

      // 기타 네트워크 에러 등
      console.error("Error fetching user role:", error);
      return null; // 에러 발생 시 null 반환하여 로그아웃 상태로 처리
    }
  },

  /**
   * 사용자 프로필을 업데이트합니다.
   * @param profileData - 업데이트할 프로필 데이터
   * @returns 업데이트된 사용자 프로필 데이터
   */
  async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfileResponse> {
    const endpoint = API_PATHS.users.updateProfile;
    const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: "PUT",
      body: JSON.stringify(profileData),
    })) as Response;

    if (!response.ok) {
      throw new AuthError(response.status, "Failed to update profile", endpoint);
    }

    const apiResponse: ResponseDtoUserProfileResponse = await response.json();
    return apiResponse.data as UserProfileResponse;
  },
} as const;

/**
 * [추천] 서버 컴포넌트/액션 등에서 사용할 현재 사용자 정보 조회 함수입니다.
 * TanStack Query 대신 직접 서비스를 호출하는 경우에 사용합니다.
 */
export async function getCurrentUser(): Promise<UserProfileResponse | null> {
  try {
    // userService.getProfile이 내부적으로 fetchWithAuth를 사용하므로
    // 서버 환경에서도 인증 헤더가 자동으로 처리됩니다.
    const userProfile = await userService.getProfile();
    return userProfile;
  } catch (error) {
    if (error instanceof AuthError && error.status === 401) {
      return null;
    }
    console.error("Failed to get current user:", error);
    return null;
  }
}
