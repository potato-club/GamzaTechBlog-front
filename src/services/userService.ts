import { fetchWithAuth } from "@/lib/api";
import type {
  UpdateProfileRequest,
  UserActivityResponse,
  UserProfileRequest,
  UserProfileResponse,
  ResponseDto,
} from "@/generated/api";
import { API_CONFIG } from "../config/api";
import { API_PATHS } from "../constants/apiPaths";

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

    const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      cache: "no-cache", // TanStack Query가 캐싱을 담당하므로 fetch 캐싱 비활성화
    })) as Response;
    if (!response.ok) {
      throw new AuthError(response.status, "Failed to get user profile", endpoint);
    }

    const apiResponse: ResponseDto = await response.json();
    return apiResponse.data as UserProfileResponse;
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

    const apiResponse: ResponseDto = await response.json();
    return apiResponse.data as UserProfileResponse;
  },

  /**
   * 프로필 완성을 수행합니다.
   * POST 뮤테이션 작업이므로 캐싱하지 않습니다.
   */
  async completeProfile(profileData: UserProfileRequest): Promise<UserProfileResponse> {
    const endpoint = API_PATHS.users.completeProfile;
    const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: "POST",
      body: JSON.stringify(profileData),
    })) as Response;
    if (!response.ok) {
      throw new AuthError(response.status, "Failed to complete profile", endpoint);
    }
    const apiResponse: ResponseDto = await response.json();
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

    const apiResponse: ResponseDto = await response.json();
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

      if (response.status === 401) {
        // 인증되지 않은 상태
        return null;
      } // 200 OK 외의 다른 에러 상태 코드 처리
      if (!response.ok) {
        throw new AuthError(response.status, "Failed to get user role", endpoint);
      }

      const apiResponse: ResponseDto = await response.json();
      return apiResponse.data as string;
    } catch (error) {
      // fetchWithAuth 자체에서 발생한 에러 (네트워크 등)
      console.error("Error fetching user role:", error);
      throw error; // 에러를 다시 던져서 useQuery가 처리하도록 함
    }
  },

  /**
   * 프로필 이미지를 업로드합니다.
   * @param imageFile - 업로드할 이미지 파일
   * @returns 업로드된 이미지의 URL
   */
  async updateProfileImage(imageFile: File): Promise<string> {
    const endpoint = API_PATHS.users.profileImage;

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: "PUT",
      body: formData,
      // Content-Type을 설정하지 않음 - 브라우저가 자동으로 multipart/form-data로 설정
    })) as Response;

    if (!response.ok) {
      throw new AuthError(response.status, "Failed to upload profile image", endpoint);
    }

    const apiResponse: ResponseDto = await response.json();
    return apiResponse.data as string;
  } /**
   * 사용자 프로필을 업데이트합니다.
   * @param profileData - 업데이트할 프로필 데이터
   * @returns 업데이트된 사용자 프로필 데이터
   */,
  async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfileResponse> {
    const endpoint = API_PATHS.users.updateProfile;
    const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: "PUT",
      body: JSON.stringify(profileData),
    })) as Response;

    if (!response.ok) {
      throw new AuthError(response.status, "Failed to update profile", endpoint);
    }

    const apiResponse: ResponseDto = await response.json();
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
