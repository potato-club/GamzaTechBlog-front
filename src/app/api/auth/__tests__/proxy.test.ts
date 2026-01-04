/**
 * forwardAuthRequest 테스트
 *
 * 모듈이 로드 시점에 API_BASE_URL을 캐싱하므로,
 * 각 테스트마다 jest.resetModules()로 모듈을 리셋하고 동적 임포트합니다.
 */

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("forwardAuthRequest", () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  beforeEach(() => {
    // 각 테스트 전에 모듈 캐시 초기화
    jest.resetModules();
  });

  afterEach(() => {
    // 환경변수 복원
    if (originalBaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_API_BASE_URL = originalBaseUrl;
    }
    jest.restoreAllMocks();
  });

  // Given: BASE URL 미설정
  // When: 프록시 요청 수행
  // Then: 500 응답 반환
  it("BASE URL이 없으면 500을 반환해야 함", async () => {
    // 환경변수 삭제 (모듈 임포트 전에 설정해야 함)
    delete process.env.NEXT_PUBLIC_API_BASE_URL;

    // 동적 임포트로 새로운 모듈 인스턴스 로드
    const { forwardAuthRequest } = await import("@/app/api/auth/_proxy");

    const request = new Request("http://localhost/api/auth/reissue", { method: "POST" });
    const response = await forwardAuthRequest(request, "/api/auth/reissue");

    expect(response.status).toBe(500);
  });

  // Given: POST 요청 + 쿠키/인증 헤더/JSON 바디
  // When: 프록시 요청 수행
  // Then: 메서드/헤더/바디를 그대로 전달
  it("메서드/헤더/바디를 그대로 전달해야 함", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://example.com";

    const { cookies } = await import("next/headers");
    const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
    const mockCookies = {
      get: jest.fn().mockReturnValue({ name: "authorization", value: "server-token" }),
    } as unknown as Awaited<ReturnType<typeof cookies>>;
    cookiesMock.mockResolvedValue(mockCookies);

    const { forwardAuthRequest } = await import("@/app/api/auth/_proxy");

    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const payload = JSON.stringify({ username: "demo" });
    const request = new Request("http://localhost/api/auth/reissue", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "authorization=token",
        authorization: "Bearer token",
      },
      body: payload,
    });

    await forwardAuthRequest(request, "/api/auth/reissue");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://example.com/api/auth/reissue");
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe(payload);

    const headers = init?.headers as Headers;
    expect(headers.get("cookie")).toBe("authorization=token");
    expect(headers.get("authorization")).toBe("Bearer token");
    expect(headers.get("content-type")).toBe("application/json");
  });

  // Given: 인증 헤더 없이 쿠키에 토큰만 있는 요청
  // When: 프록시 요청 수행
  // Then: 서버 쿠키 토큰이 Authorization 헤더로 전달
  it("Authorization 헤더가 없으면 서버 쿠키 토큰을 주입해야 함", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://example.com";

    const { cookies } = await import("next/headers");
    const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
    const mockCookies = {
      get: jest.fn().mockReturnValue({ name: "authorization", value: "server-token" }),
    } as unknown as Awaited<ReturnType<typeof cookies>>;
    cookiesMock.mockResolvedValue(mockCookies);

    const { forwardAuthRequest } = await import("@/app/api/auth/_proxy");

    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const request = new Request("http://localhost/api/auth/logout", {
      method: "POST",
      headers: {
        cookie: "authorization=token",
      },
    });

    await forwardAuthRequest(request, "/api/auth/me/logout");

    const [, init] = fetchMock.mock.calls[0];
    const headers = init?.headers as Headers;
    expect(headers.get("authorization")).toBe("Bearer server-token");
  });

  // Given: GET 요청
  // When: 프록시 요청 수행
  // Then: 바디를 전달하지 않음
  it("GET 요청은 바디를 전달하지 않아야 함", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://example.com";

    const { cookies } = await import("next/headers");
    const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
    const mockCookies = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as Awaited<ReturnType<typeof cookies>>;
    cookiesMock.mockResolvedValue(mockCookies);

    const { forwardAuthRequest } = await import("@/app/api/auth/_proxy");

    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const request = new Request("http://localhost/api/auth/reissue", { method: "GET" });

    await forwardAuthRequest(request, "/api/auth/reissue");

    const [, init] = fetchMock.mock.calls[0];
    expect(init?.body).toBeUndefined();
  });
});
