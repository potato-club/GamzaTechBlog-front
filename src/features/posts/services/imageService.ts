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
} as const;
