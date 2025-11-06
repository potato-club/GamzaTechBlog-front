import type {
  DefaultApi,
  Pageable,
  ProfileImageResponse,
  UpdateProfileRequest,
  UserActivityResponse,
  UserProfileRequest,
  UserProfileResponse,
  UserPublicProfileResponse,
} from "@/generated/api";

/**
 * User Service 팩토리 함수
 *
 * 클라이언트/서버 환경 모두에서 사용 가능한 공통 로직을 제공합니다.
 * API 클라이언트 인스턴스를 주입받아 환경에 독립적으로 동작합니다.
 *
 * @param api - DefaultApi 인스턴스 (클라이언트용 또는 서버용)
 * @returns User Service 객체
 *
 * @example
 * // 클라이언트 환경
 * const userService = createUserService(apiClient);
 *
 * @example
 * // 서버 환경
 * const userService = createUserService(createServerApiClient());
 */
export const createUserService = (api: DefaultApi) => {
  return {
    /**
     * 사용자 프로필 정보를 가져옵니다.
     *
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 사용자 프로필 정보
     */
    async getProfile(options?: RequestInit): Promise<UserProfileResponse> {
      const response = await api.getCurrentUserProfile(options);
      return response.data as UserProfileResponse;
    },

    /**
     * 로그아웃을 수행합니다.
     */
    async logout(): Promise<void> {
      await api.logout();
    },

    /**
     * 회원가입 중 프로필 정보를 업데이트합니다.
     *
     * @param profileData - 프로필 데이터
     * @returns 업데이트된 프로필 정보
     */
    async updateProfileInSignup(profileData: UserProfileRequest): Promise<UserProfileResponse> {
      const response = await api.completeProfile({
        userProfileRequest: profileData,
      });
      return response.data as UserProfileResponse;
    },

    /**
     * 계정 탈퇴를 수행합니다.
     */
    async withdrawAccount(): Promise<void> {
      await api.withdraw();
    },

    /**
     * 사용자 활동 통계(작성 게시글 수, 댓글 수, 좋아요 수)를 가져옵니다.
     *
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 활동 통계 정보
     */
    async getActivityCounts(options?: RequestInit): Promise<UserActivityResponse> {
      const response = await api.getActivitySummary(options);
      return response.data as UserActivityResponse;
    },

    /**
     * 사용자의 현재 역할만 가져옵니다.
     *
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 사용자 역할 또는 null (에러 시)
     */
    async getUserRole(options?: RequestInit): Promise<string | null> {
      try {
        const response = await api.getCurrentUserRole(options);
        return response.data as string;
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
      const response = await api.updateProfile({
        updateProfileRequest: profileData,
      });
      return response.data as UserProfileResponse;
    },

    /**
     * 사용자 프로필 이미지를 업데이트합니다.
     *
     * @param imageFile - 업로드할 이미지 파일
     * @returns 업데이트된 프로필 이미지 정보
     */
    async updateProfileImage(imageFile: File): Promise<ProfileImageResponse> {
      const response = await api.updateProfileImage({
        imageFile: imageFile,
      });
      return response.data as ProfileImageResponse;
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
      const response = await api.getPublicProfileByNickname(
        {
          nickname,
          ...(params || {}),
        },
        options
      );
      return response.data as UserPublicProfileResponse;
    },
  };
};

/**
 * User Service 타입
 */
export type UserService = ReturnType<typeof createUserService>;
