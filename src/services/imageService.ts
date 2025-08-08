import { API_CONFIG } from "@/config/api";
import { API_PATHS } from "@/constants/apiPaths";
import { fetchWithAuth } from "@/lib/api";
import {
  type ProfileImageResponse,
  type ResponseDtoProfileImageResponse,
  type ResponseDtoString,
} from "../generated/api";

export class ImageServiceError extends Error {
  constructor(
    public status: number,
    message: string,
    public endpoint?: string,
  ) {
    super(message);
    this.name = "ImageServiceError";
  }
}

export const imageService = {
  /**
   * 이미지를 업로드하고 URL을 반환합니다.
   * @param file - 업로드할 이미지 파일
   * @returns 업로드된 이미지 URL
   */
  async uploadImage(file: File): Promise<string> {
    const endpoint = API_PATHS.posts.images;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
        method: "POST",
        body: formData,
        // Content-Type은 FormData 사용 시 자동으로 설정되므로 설정하지 않음
      })) as Response;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Failed to upload image",
        }));
        throw new ImageServiceError(
          response.status,
          errorData.message || "Failed to upload image",
          endpoint,
        );
      }

      const apiResponse: ResponseDtoString = await response.json();
      return apiResponse.data as string; // 타입 단언을 사용하여 string으로 캐스팅
    } catch (error) {
      if (error instanceof ImageServiceError) {
        throw error;
      }
      throw new ImageServiceError(
        500,
        (error as Error).message ||
          "An unexpected error occurred while uploading image",
        endpoint,
      );
    }
  },

  /**
   * 프로필 이미지를 업로드합니다.
   * @param imageFile - 업로드할 이미지 파일
   * @returns 업로드된 이미지의 URL
   */
  async updateProfileImage(imageFile: File): Promise<ProfileImageResponse> {
    const endpoint = API_PATHS.users.profileImage;

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: "PUT",
      body: formData,
      // Content-Type을 설정하지 않음 - 브라우저가 자동으로 multipart/form-data로 설정
    })) as Response;

    if (!response.ok) {
      throw new ImageServiceError(
        response.status,
        "Failed to upload profile image",
        endpoint,
      );
    }

    const apiResponse: ResponseDtoProfileImageResponse = await response.json();
    return apiResponse.data as ProfileImageResponse;
  },
} as const;
