import type { ProfileImageResponse } from "@/generated/api";
import { apiClient } from "@/lib/apiClient";

export const imageService = {
  /**
   * 이미지를 업로드하고 URL을 반환합니다.
   * @param file - 업로드할 이미지 파일
   * @returns 업로드된 이미지 URL
   */
  async uploadImage(file: File): Promise<string> {
    const response = await apiClient.uploadImage({ file });
    return response.data as string;
  },

  /**
   * 프로필 이미지를 업로드합니다.
   * @param imageFile - 업로드할 이미지 파일
   * @returns 업로드된 이미지의 URL
   */
  async updateProfileImage(imageFile: File): Promise<ProfileImageResponse> {
    const response = await apiClient.updateProfileImage({ imageFile });
    return response.data as ProfileImageResponse;
  },
} as const;
