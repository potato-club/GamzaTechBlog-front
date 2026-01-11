import {
  ProfileImageResponse,
  UpdateProfileRequest,
  UserProfileRequest,
  UserProfileResponse,
} from "@/generated/api";
import { apiClient } from "@/lib/apiClient";

export const userService = {
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
