import "server-only";

import type {
  Pageable,
  ProfileImageResponse,
  UpdateProfileRequest,
  UserActivityResponse,
  UserProfileRequest,
  UserProfileResponse,
  UserPublicProfileResponse,
} from "@/generated/orval/models";
import { serverApiFetchJson } from "@/lib/serverApiFetch";

/**
 * User Service 팩토리 함수
 *
 * 서버 환경에서 사용 가능한 공통 로직을 제공합니다.
 *
 * @returns User Service 객체
 */
export const createUserService = () => {
  return {
    /**
     * 사용자 프로필 정보를 가져옵니다.
     *
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 사용자 프로필 정보
     */
    async getProfile(options?: RequestInit): Promise<UserProfileResponse> {
      const payload = await serverApiFetchJson<{ data?: UserProfileResponse }>(
        "/api/v1/users/me/get/profile",
        options
      );

      if (!payload.data) {
        throw new Error("User profile response data is missing.");
      }

      return payload.data;
    },

    /**
     * 로그아웃을 수행합니다.
     */
    async logout(): Promise<void> {
      await serverApiFetchJson("/api/auth/me/logout", {
        method: "POST",
      });
    },

    /**
     * 회원가입 중 프로필 정보를 업데이트합니다.
     *
     * @param profileData - 프로필 데이터
     * @returns 업데이트된 프로필 정보
     */
    async updateProfileInSignup(profileData: UserProfileRequest): Promise<UserProfileResponse> {
      const payload = await serverApiFetchJson<{ data?: UserProfileResponse }>(
        "/api/v1/users/me/complete",
        {
          method: "POST",
          body: JSON.stringify(profileData),
        }
      );

      if (!payload.data) {
        throw new Error("User profile response data is missing.");
      }

      return payload.data;
    },

    /**
     * 계정 탈퇴를 수행합니다.
     */
    async withdrawAccount(): Promise<void> {
      await serverApiFetchJson("/api/v1/users/me/withdraw", {
        method: "DELETE",
      });
    },

    /**
     * 사용자 활동 통계(작성 게시글 수, 댓글 수, 좋아요 수)를 가져옵니다.
     *
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 활동 통계 정보
     */
    async getActivityCounts(options?: RequestInit): Promise<UserActivityResponse> {
      const payload = await serverApiFetchJson<{ data?: UserActivityResponse }>(
        "/api/v1/users/me/activity",
        options
      );

      if (!payload.data) {
        throw new Error("User activity response data is missing.");
      }

      return payload.data;
    },

    /**
     * 사용자의 현재 역할만 가져옵니다.
     *
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 사용자 역할 또는 null (에러 시)
     */
    async getUserRole(options?: RequestInit): Promise<string | null> {
      try {
        const payload = await serverApiFetchJson<{ data?: string }>(
          "/api/v1/users/me/role",
          options
        );
        return payload.data ?? null;
      } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
    },

    /**
     * 사용자 프로필을 업데이트합니다.
     *
     * @param profileData - 업데이트할 프로필 데이터
     * @returns 업데이트된 프로필 정보
     */
    async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfileResponse> {
      const payload = await serverApiFetchJson<{ data?: UserProfileResponse }>(
        "/api/v1/users/me/update/profile",
        {
          method: "PUT",
          body: JSON.stringify(profileData),
        }
      );

      if (!payload.data) {
        throw new Error("User profile response data is missing.");
      }

      return payload.data;
    },

    /**
     * 사용자 프로필 이미지를 업데이트합니다.
     *
     * @param imageFile - 업로드할 이미지 파일
     * @returns 업데이트된 프로필 이미지 정보
     */
    async updateProfileImage(imageFile: File): Promise<ProfileImageResponse> {
      const formData = new FormData();
      formData.append("imageFile", imageFile);

      const payload = await serverApiFetchJson<{ data?: ProfileImageResponse }>(
        "/api/v1/profile-images",
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!payload.data) {
        throw new Error("Profile image response data is missing.");
      }

      return payload.data;
    },

    /**
     * 사용자명으로 공개 프로필 정보를 가져옵니다.
     *
     * @param nickname - 사용자명
     * @param params - 페이지네이션 파라미터 (선택)
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 공개 프로필 정보
     */
    async getPublicProfile(
      nickname: string,
      params?: Pageable,
      options?: RequestInit
    ): Promise<UserPublicProfileResponse> {
      const searchParams = new URLSearchParams();

      if (typeof params?.page === "number") {
        searchParams.set("page", params.page.toString());
      }
      if (typeof params?.size === "number") {
        searchParams.set("size", params.size.toString());
      }
      if (params?.sort?.length) {
        params.sort.forEach((sortKey) => {
          searchParams.append("sort", sortKey);
        });
      }

      const query = searchParams.toString();
      const payload = await serverApiFetchJson<{ data?: UserPublicProfileResponse }>(
        `/api/v1/users/public/profile/${nickname}${query ? `?${query}` : ""}`,
        options
      );

      if (!payload.data) {
        throw new Error("Public profile response data is missing.");
      }

      return payload.data;
    },
  };
};

/**
 * User Service 타입
 */
export type UserService = ReturnType<typeof createUserService>;
