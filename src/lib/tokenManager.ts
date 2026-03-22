/**
 * 인증 만료 처리 유틸리티
 *
 * 토큰 재발급은 src/proxy.ts(Middleware)에서 자동 처리됩니다.
 * 이 모듈은 만료 시 클라이언트 상태 정리와 로그아웃 처리만 담당합니다.
 */

import { USER_QUERY_KEYS } from "@/features/user/queryKeys";

/**
 * 토큰 만료로 인한 로그아웃 처리
 * 쿼리 캐시 정리 및 리다이렉트를 수행합니다.
 */
export function handleTokenExpiration(
  queryClient?: {
    removeQueries: (filters: { queryKey: readonly string[] }) => void;
    clear?: () => void;
  },
  redirectPath?: string
): void {
  if (queryClient) {
    if ("clear" in queryClient && typeof queryClient.clear === "function") {
      queryClient.clear();
    } else {
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.profile() });
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.role() });
    }
  }

  console.warn("토큰이 만료되어 로그아웃 처리되었습니다.");

  if (typeof window !== "undefined" && redirectPath) {
    window.location.href = redirectPath;
  }
}

/**
 * 통합 로그아웃 처리 함수
 * 백엔드 로그아웃 API 호출 후 클라이언트 상태를 정리합니다.
 */
export async function performLogout(
  logoutApiCall: () => Promise<void>,
  queryClient?: {
    removeQueries: (filters: { queryKey: readonly string[] }) => void;
    clear?: () => void;
  },
  redirectPath?: string
): Promise<void> {
  try {
    await logoutApiCall();
  } catch (logoutError) {
    console.error("백엔드 로그아웃 API 호출 실패:", logoutError);
  } finally {
    handleTokenExpiration(queryClient, redirectPath);
  }
}
