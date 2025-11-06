import type { ActionResult } from "../actions/types";

/**
 * 에러 코드 상수
 *
 * 에러 타입을 명확히 구분하여 클라이언트에서 적절한 처리 가능
 */
export const ERROR_CODES = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  NOT_FOUND: "NOT_FOUND",
} as const;

/**
 * 에러를 ActionResult 형식으로 변환
 *
 * 모든 에러를 일관된 형식으로 변환하여 클라이언트에서 처리하기 쉽게 만듭니다.
 *
 * @param error - 발생한 에러
 * @returns 표준화된 에러 결과
 */
export function handleActionError(error: unknown): ActionResult<never> {
  console.error("Server Action Error:", error);

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      code: ERROR_CODES.UNKNOWN_ERROR,
    };
  }

  return {
    success: false,
    error: "알 수 없는 오류가 발생했습니다.",
    code: ERROR_CODES.UNKNOWN_ERROR,
  };
}

/**
 * 성공 결과 생성
 *
 * 타입 안전한 성공 결과를 생성합니다.
 *
 * @param data - 성공 시 반환할 데이터
 * @returns 성공 결과
 */
export function createSuccessResult<T>(data: T): ActionResult<T> {
  return { success: true, data };
}
