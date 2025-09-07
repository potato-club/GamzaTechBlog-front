import {
  IntroCreateRequest,
  IntroResponse,
  Pageable,
  PagedResponseIntroResponse,
} from "@/generated/api";
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

  /**
   * 새 자기소개를 작성합니다.
   */
  async createIntro(content: string): Promise<IntroResponse> {
    const introCreateRequest: IntroCreateRequest = { content };
    const response = await apiClient.createIntro({ introCreateRequest });
    return response.data as IntroResponse;
  },

  /**
   * 자기소개를 삭제합니다.
   */
  async deleteIntro(introId: number): Promise<void> {
    await apiClient.deleteIntro({ introId });
  },
} as const;
