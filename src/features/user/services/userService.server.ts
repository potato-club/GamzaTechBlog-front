import "server-only";

import type {
  Pageable,
  ProfileImageResponse,
  UpdateProfileRequest,
  UserActivityResponse,
  UserProfileRequest,
  UserProfileResponse,
  UserPublicProfileResponse,
} from "@/generated/api";
import { createBackendApiClient } from "@/lib/serverApiClient";
import { unwrapData } from "@/lib/unwrapData";

/**
 * 서버 전용 User Service 팩토리 함수
 *
 * 서버 컴포넌트, Server Actions, Route Handlers에서 사용합니다.
 * next/headers의 cookies()를 통해 현재 요청의 쿠키를 자동으로 포함합니다.
 */
export const createUserServiceServer = () => {
  const api = createBackendApiClient();

  return {
    async getProfile(options?: RequestInit): Promise<UserProfileResponse> {
      const response = await api.getCurrentUserProfile(options);
      return unwrapData(response);
    },

    async logout(): Promise<void> {
      await api.logout();
    },

    async updateProfileInSignup(profileData: UserProfileRequest): Promise<UserProfileResponse> {
      const response = await api.completeProfile({
        userProfileRequest: profileData,
      });
      return unwrapData(response);
    },

    async withdrawAccount(): Promise<void> {
      await api.withdraw();
    },

    async getActivityCounts(options?: RequestInit): Promise<UserActivityResponse> {
      const response = await api.getActivitySummary(options);
      return unwrapData(response);
    },

    async getUserRole(options?: RequestInit): Promise<string | null> {
      try {
        const response = await api.getCurrentUserRole(options);
        return unwrapData(response);
      } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
    },

    async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfileResponse> {
      const response = await api.updateProfile({
        updateProfileRequest: profileData,
      });
      return unwrapData(response);
    },

    async updateProfileImage(imageFile: File): Promise<ProfileImageResponse> {
      const response = await api.updateProfileImage({
        imageFile,
      });
      return unwrapData(response);
    },

    async getPublicProfile(
      nickname: string,
      params?: Pageable,
      options?: RequestInit
    ): Promise<UserPublicProfileResponse> {
      const response = await api.getPublicProfileByNickname(
        {
          nickname,
          ...(params || {}),
        },
        options
      );
      return unwrapData(response);
    },
  };
};

export type UserService = ReturnType<typeof createUserServiceServer>;

/**
 * 서버 컴포넌트/액션에서 현재 사용자 정보를 조회합니다.
 */
export async function getCurrentUser(): Promise<UserProfileResponse | null> {
  try {
    const userService = createUserServiceServer();
    return await userService.getProfile({ cache: "no-store" });
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

/**
 * 서버 컴포넌트에서 공개 프로필 정보를 조회합니다.
 */
export async function getPublicUser(
  nickname: string,
  params?: Pageable
): Promise<UserPublicProfileResponse | null> {
  try {
    const userService = createUserServiceServer();
    return await userService.getPublicProfile(nickname, params);
  } catch (error) {
    console.error(`Failed to get public user profile for ${nickname}:`, error);
    return null;
  }
}
