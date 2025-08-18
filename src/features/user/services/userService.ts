import {
  ProfileImageResponse,
  UpdateProfileRequest,
  UserActivityResponse,
  UserProfileRequest,
  UserProfileResponse,
} from "@/generated/api";
import { apiClient } from "@/lib/apiClient";

export const userService = {
  /**
   * 사용자 프로필 정보를 가져옵니다.
   */
  async getProfile(): Promise<UserProfileResponse> {
    const response = await apiClient.getCurrentUserProfile();
    return response.data as UserProfileResponse;
  },

  /**
   * 로그아웃을 수행합니다.
   */
  async logout(): Promise<void> {
    await apiClient.logout();
  },

  /**
   * 회원가입 중 프로필 정보를 업데이트합니다.
   */
  async updateProfileInSignup(profileData: UserProfileRequest): Promise<UserProfileResponse> {
    const response = await apiClient.completeProfile({
      userProfileRequest: profileData,
    });
    return response.data as UserProfileResponse;
  },

  /**
   * 계정 탈퇴를 수행합니다.
   */
  async withdrawAccount(): Promise<void> {
    await apiClient.withdraw();
  },

  /**
   * 사용자 활동 통계(작성 게시글 수, 댓글 수, 좋아요 수)를 가져옵니다.
   */
  async getActivityCounts(): Promise<UserActivityResponse> {
    const response = await apiClient.getActivitySummary();
    return response.data as UserActivityResponse;
  },

  /**
   * 사용자의 현재 역할만 가져옵니다.
   */
  async getUserRole(): Promise<string | null> {
    try {
      const response = await apiClient.getCurrentUserRole();
      return response.data as string;
    } catch (error) {
      // apiClient는 401/403에서 ResponseError를 throw합니다.
      // 에러 객체를 확인하여 상태 코드를 검사할 수 있습니다.
      // 여기서는 간단히 null을 반환하여 로그아웃 상태로 처리합니다.
      console.error("Error fetching user role:", error);
      return null;
    }
  },

  /**
   * 사용자 프로필을 업데이트합니다.
   */
  async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfileResponse> {
    const response = await apiClient.updateProfile({
      updateProfileRequest: profileData,
    });
    return response.data as UserProfileResponse;
  },

  /**
   * 사용자 프로필 이미지를 업데이트합니다.
   */
  async updateProfileImage(imageFile: File): Promise<ProfileImageResponse> {
    const response = await apiClient.updateProfileImage({
      imageFile: imageFile,
    });
    return response.data as ProfileImageResponse;
  },
} as const;

/**
 * [추천] 서버 컴포넌트/액션 등에서 사용할 현재 사용자 정보 조회 함수입니다.
 */
export async function getCurrentUser(): Promise<UserProfileResponse | null> {
  try {
    const userProfile = await userService.getProfile();
    return userProfile;
  } catch (error) {
    // apiClient가 throw하는 ResponseError를 캐치할 수 있습니다.
    // if (error instanceof ResponseError && error.response.status === 401) {
    //   return null;
    // }
    console.error("Failed to get current user:", error);
    return null;
  }
}
