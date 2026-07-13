import { ResponseError } from "@/generated/api";

/**
 * 백엔드가 "리소스가 확정적으로 없음(404)"이라고 응답한 에러만 true.
 *
 * 5xx(백엔드 다운)·네트워크 오류·기타 예외는 false를 반환한다. 호출부는 이 경우
 * `notFound()`로 처리하지 말고 에러를 재던져야 한다 — ISR은 렌더 결과를 캐시하므로,
 * 일시적 오류를 not-found 페이지로 렌더하면 그 잘못된 페이지가 캐시에 박혀(최대 revalidate
 * 기간 동안) 백엔드 복구 후에도 계속 서빙된다(캐시 오염). 404만 캐시 가능한 확정 상태다.
 */
export function isNotFoundError(error: unknown): boolean {
  return error instanceof ResponseError && error.response.status === 404;
}
