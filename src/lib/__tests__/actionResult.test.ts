import {
  ERROR_CODES,
  createSuccessResult,
  handleActionError,
  withActionResult,
} from "@/lib/actionResult";
import { FetchError, ResponseError } from "@/generated/api";

describe("actionResult 유틸", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("성공 결과를 생성해야 함", () => {
    // Given
    const payload = { id: 1 };

    // When
    const result = createSuccessResult(payload);

    // Then
    expect(result).toEqual({ success: true, data: payload });
  });

  it("Error 인스턴스는 메시지와 코드로 변환해야 함", async () => {
    // Given
    const error = new Error("에러 발생");

    // When
    const result = await handleActionError(error);

    // Then
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: false,
      error: "에러 발생",
      code: ERROR_CODES.UNKNOWN_ERROR,
    });
  });

  it("Error가 아니면 기본 메시지로 변환해야 함", async () => {
    // Given
    const error = "문자열 에러";

    // When
    const result = await handleActionError(error);

    // Then
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: false,
      error: "알 수 없는 오류가 발생했습니다.",
      code: ERROR_CODES.UNKNOWN_ERROR,
    });
  });

  it("withActionResult는 성공 결과를 래핑해야 함", async () => {
    // Given
    const action = jest.fn().mockResolvedValue({ ok: true });
    const wrapped = withActionResult(action);

    // When
    const result = await wrapped(1, 2, 3);

    // Then
    expect(action).toHaveBeenCalledWith(1, 2, 3);
    expect(result).toEqual({ success: true, data: { ok: true } });
  });

  it("withActionResult는 실패 결과를 래핑해야 함", async () => {
    // Given
    const action = jest.fn().mockRejectedValue(new Error("실패"));
    const wrapped = withActionResult(action);

    // When
    const result = await wrapped();

    // Then
    expect(action).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: false,
      error: "실패",
      code: ERROR_CODES.UNKNOWN_ERROR,
    });
  });

  it("ResponseError의 JSON body 메시지와 코드를 보수적으로 사용해야 함", async () => {
    // Given
    const response = new Response(
      JSON.stringify({ message: "로그인이 필요합니다.", code: "UNAUTHORIZED" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
    const error = new ResponseError(response, "Response returned an error code");

    // When
    const result = await handleActionError(error);

    // Then
    expect(result).toEqual({
      success: false,
      error: "로그인이 필요합니다.",
      code: "UNAUTHORIZED",
    });
  });

  it("ResponseError body를 읽을 수 없으면 기존 메시지와 상태 코드 fallback을 사용해야 함", async () => {
    // Given
    const response = new Response("not-json", { status: 404 });
    const error = new ResponseError(response, "Response returned an error code");

    // When
    const result = await handleActionError(error);

    // Then
    expect(result).toEqual({
      success: false,
      error: "Response returned an error code",
      code: ERROR_CODES.NOT_FOUND,
    });
  });

  it("FetchError는 네트워크 오류로 변환해야 함", async () => {
    // Given
    const error = new FetchError(new Error("fetch failed"), "request failed");

    // When
    const result = await handleActionError(error);

    // Then
    expect(result).toEqual({
      success: false,
      error: "네트워크 오류가 발생했습니다.",
      code: ERROR_CODES.NETWORK_ERROR,
    });
  });
});
