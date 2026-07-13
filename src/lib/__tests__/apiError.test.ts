import { isNotFoundError } from "@/lib/apiError";
import { ResponseError, FetchError } from "@/generated/api";

function responseError(status: number): ResponseError {
  return new ResponseError({ status } as Response, "Response returned an error code");
}

describe("isNotFoundError", () => {
  it("404 ResponseError만 '확정적 부재'로 true여야 함", () => {
    expect(isNotFoundError(responseError(404))).toBe(true);
  });

  it("5xx(백엔드 다운)는 false여야 함 — 재던져 ISR 캐시 오염을 막기 위해", () => {
    expect(isNotFoundError(responseError(500))).toBe(false);
    expect(isNotFoundError(responseError(502))).toBe(false);
    expect(isNotFoundError(responseError(503))).toBe(false);
  });

  it("다른 4xx는 false여야 함 (not-found가 아님)", () => {
    expect(isNotFoundError(responseError(400))).toBe(false);
    expect(isNotFoundError(responseError(401))).toBe(false);
    expect(isNotFoundError(responseError(403))).toBe(false);
  });

  it("네트워크 오류(FetchError)는 false여야 함", () => {
    expect(isNotFoundError(new FetchError(new Error("ECONNREFUSED"), "network"))).toBe(false);
  });

  it("일반 Error·비Error 값은 false여야 함", () => {
    expect(isNotFoundError(new Error("Response data is missing."))).toBe(false);
    expect(isNotFoundError(null)).toBe(false);
    expect(isNotFoundError(undefined)).toBe(false);
    expect(isNotFoundError("404")).toBe(false);
  });
});
