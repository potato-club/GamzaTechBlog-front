import { API_CONFIG } from "@/config/api";
import { fetchWithAuth } from "@/lib/api";
import { ApiResponse } from "@/types/api";

export class ImageServiceError extends Error {
  constructor(public status: number, message: string, public endpoint?: string) {
    super(message);
    this.name = 'ImageServiceError';
  }
}

export const imageService = {
  /**
   * 이미지를 업로드하고 URL을 반환합니다.
   * @param file - 업로드할 이미지 파일
   * @returns 업로드된 이미지 URL
   */
  async uploadImage(file: File): Promise<string> {
    const endpoint = '/api/v1/posts/images';

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
        method: 'POST',
        body: formData,
        // Content-Type은 FormData 사용 시 자동으로 설정되므로 설정하지 않음
      }) as Response;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Failed to upload image'
        }));
        throw new ImageServiceError(
          response.status,
          errorData.message || 'Failed to upload image',
          endpoint
        );
      }

      const apiResponse: ApiResponse<string> = await response.json();
      return apiResponse.data; // 업로드된 이미지 URL 반환
    } catch (error) {
      if (error instanceof ImageServiceError) {
        throw error;
      }
      throw new ImageServiceError(
        500,
        (error as Error).message || 'An unexpected error occurred while uploading image',
        endpoint
      );
    }
  }
} as const;
