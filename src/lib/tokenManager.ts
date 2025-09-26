/**
 * 토큰 관리를 위한 중앙화된 유틸리티
 *
 * 이 모듈은 JWT 토큰의 삭제, 토큰 만료 처리 등을 일관되게 처리합니다.
 * 토큰 설정은 백엔드에서 자동으로 처리되므로 여기서는 삭제 및 만료 처리에 집중합니다.
 */

import { deleteCookie, getCookie } from "cookies-next";

// --- 상수 정의 ---
export const TOKEN_COOKIE_NAME = "authorization" as const;

/**

* 쿠키 삭제 시 사용할 옵션
 * 백엔드에서 설정한 쿠키와 동일한 옵션으로 삭제해야 함
 */
const DELETE_COOKIE_OPTIONS = {
  path: "/",
  domain: ".gamzatech.site",
} as const;

// --- 쿠키 관리 함수 ---

/**
 * 인증 토큰 쿠키를 가져옵니다.
 * @returns JWT 토큰 또는 undefined
 */
export function getAuthCookie(): string | undefined {
  const cookie = getCookie(TOKEN_COOKIE_NAME);
  return typeof cookie === "string" ? cookie : undefined;
}

/**
 * 인증 토큰 쿠키를 삭제합니다.
 * 백엔드에서 설정한 쿠키와 동일한 옵션으로 삭제해야 제대로 지워집니다.
 */
export function removeAuthCookie(): void {
  deleteCookie(TOKEN_COOKIE_NAME, DELETE_COOKIE_OPTIONS);
}

// --- 토큰 만료 처리 ---

/**
 * RefreshTokenInvalidError 감지 함수
 * @param error 발생한 에러 객체
 * @returns RefreshTokenInvalidError 여부
 */
export function isRefreshTokenInvalidError(error: unknown): boolean {
  return (
    error !== null &&
    typeof error === "object" &&
    "name" in error &&
    error.name === "RefreshTokenInvalidError"
  );
}

/**
 * 토큰 만료로 인한 로그아웃 처리
 * 쿠키 삭제, 쿼리 캐시 정리를 수행합니다.
 *
 * @param queryClient TanStack Query 클라이언트 (선택적)
 * @param redirectPath 리다이렉트할 경로 (선택적)
 */
export function handleTokenExpiration(
  queryClient?: {
    removeQueries: (filters: { queryKey: readonly string[] }) => void;
    clear?: () => void;
  },
  redirectPath?: string
): void {
  // 1. 쿠키 삭제
  removeAuthCookie();

  // 2. 쿼리 캐시 정리
  if (queryClient) {
    if ("clear" in queryClient && typeof queryClient.clear === "function") {
      queryClient.clear();
    } else {
      // 개별 쿼리 정리
      queryClient.removeQueries({ queryKey: ["user", "profile"] });
      queryClient.removeQueries({ queryKey: ["user", "role"] });
    }
  }

  // 3. 로그 출력
  console.warn("토큰이 만료되어 로그아웃 처리되었습니다.");

  // 4. 리다이렉트 (클라이언트 환경에서만)
  if (typeof window !== "undefined" && redirectPath) {
    window.location.href = redirectPath;
  }
}

/**
 * 통합 로그아웃 처리 함수
 * API 호출, 쿠키 삭제, 캐시 정리를 모두 수행합니다.
 *
 * @param logoutApiCall 백엔드 로그아웃 API 호출 함수
 * @param queryClient TanStack Query 클라이언트
 * @param redirectPath 로그아웃 후 리다이렉트할 경로
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
    // 1. 백엔드 로그아웃 API 호출
    await logoutApiCall();
  } catch (logoutError) {
    console.error("백엔드 로그아웃 API 호출 실패:", logoutError);
  } finally {
    // 2. 로컬 정리 작업 (API 실패와 관계없이 수행)
    handleTokenExpiration(queryClient, redirectPath);
  }
}

// --- 토큰 만료 시간 관리 ---

let tokenExpirationTime: number | null = null;

/**
 * 토큰의 만료 시간을 설정합니다.
 * @param expirationTime 만료 시간 (밀리초 단위 타임스탬프)
 */
export function setTokenExpiration(expirationTime: number): void {
  tokenExpirationTime = expirationTime;
}

/**
 * 현재 설정된 토큰 만료 시간을 가져옵니다.
 * @returns 만료 시간 (밀리초) 또는 null
 */
export function getTokenExpiration(): number | null {
  return tokenExpirationTime;
}

/**
 * 토큰 만료 시간을 초기화합니다.
 */
export function clearTokenExpiration(): void {
  tokenExpirationTime = null;
}

/**
 * 토큰이 곧 만료될지 확인합니다.
 * @param bufferMs 버퍼 시간 (기본값: 60초)
 * @returns 토큰이 곧 만료될지 여부
 */
export function isTokenNearExpiration(bufferMs: number = 60 * 1000): boolean {
  if (!tokenExpirationTime) return false;
  return tokenExpirationTime < Date.now() + bufferMs;
}
