import { Pageable, PagedResponseIntroResponse } from "@/generated/api";
import { apiClient } from "@/lib/apiClient";

export const introService = {
  /**
   * 자기소개 목록을 조회합니다.
   */
  async getIntroList(
    params?: Pageable,
    options?: RequestInit
  ): Promise<PagedResponseIntroResponse> {
    const response = await apiClient.getIntroList(params || {}, options);
    return response.data as PagedResponseIntroResponse;
  },
} as const;
