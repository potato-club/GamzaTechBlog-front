import type { ResponseDtoString } from "@/generated/orval/models";

export const imageService = {
  /**
   * 이미지를 업로드하고 URL을 반환합니다.
   * @param file - 업로드할 이미지 파일
   * @returns 업로드된 이미지 URL
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/posts/images", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as ResponseDtoString | null;
      const message = errorBody?.message || "이미지 업로드에 실패했습니다.";
      throw new Error(message);
    }

    const data = (await response.json()) as ResponseDtoString;
    if (!data?.data) {
      throw new Error("이미지 업로드 응답이 올바르지 않습니다.");
    }

    return data.data;
  },
} as const;
