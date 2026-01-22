import "server-only";

import type { PendingUserResponse } from "@/generated/orval/models";
import { createBackendApiClient } from "@/lib/serverApiClient";

export const createAdminServiceServer = () => {
  const api = createBackendApiClient();

  return {
    /**
     * 승인 대기 중인 사용자 목록 조회
     *
     * 개인화 데이터이므로 항상 최신 데이터를 가져옵니다.
     */
    async getPendingUsers(
      requestInit: RequestInit = { cache: "no-store" }
    ): Promise<PendingUserResponse[]> {
      const response = await api.getPendingUsers(requestInit);
      return (response.data as PendingUserResponse[]) || [];
    },
  };
};
