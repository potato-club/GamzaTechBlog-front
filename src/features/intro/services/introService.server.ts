import "server-only";

import type { Pageable, PagedResponseIntroResponse } from "@/generated/api";
import { createBackendApiClient } from "@/lib/serverApiClient";

/**
 * 서버 전용 Intro Service 팩토리 함수
 */
export const createIntroServiceServer = () => {
  const api = createBackendApiClient();

  return {
    async getIntroList(
      params?: Pageable,
      options?: RequestInit
    ): Promise<PagedResponseIntroResponse> {
      const response = await api.getIntroList(params || {}, options);
      return response.data as PagedResponseIntroResponse;
    },
  };
};
