/**
 * forwardUserRequest 테스트
 *
 * 모듈이 로드 시점에 API_BASE_URL을 캐싱하므로,
 * 각 테스트마다 jest.resetModules()로 모듈을 리셋하고 동적 임포트합니다.
 */

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("forwardUserRequest", () => {
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

  it("BASE URL이 없으면 500을 반환해야 함", async () => {
    // Given: BASE URL 미설정
    delete process.env.NEXT_PUBLIC_API_BASE_URL;

    // When: 프록시 요청 수행
    const { forwardUserRequest } = await import("@/app/api/users/_proxy");
    const request = new Request("http://localhost/api/users/me/profile", { method: "GET" });
    const response = await forwardUserRequest(request, "/api/v1/users/me/get/profile");

    // Then: 500 응답 반환
    expect(response.status).toBe(500);
  });

  it("메서드/헤더/바디/검색 파라미터를 전달해야 함", async () => {
    // Given: POST 요청 + 쿠키/JSON 바디 + 서버 쿠키 토큰
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://example.com";

    const { cookies } = await import("next/headers");
    const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
    const mockCookies = {
      get: jest.fn().mockReturnValue({ name: "authorization", value: "server-token" }),
    } as unknown as Awaited<ReturnType<typeof cookies>>;
    cookiesMock.mockResolvedValue(mockCookies);

    const { forwardUserRequest } = await import("@/app/api/users/_proxy");
    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const payload = JSON.stringify({ nickname: "demo" });
    const request = new Request("http://localhost/api/users/me/profile?source=client", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "authorization=client-token",
      },
      body: payload,
    });

    // When: 프록시 요청 수행
    await forwardUserRequest(request, "/api/v1/users/me/get/profile");

    // Then: 백엔드 요청에 메서드/헤더/바디/쿼리가 전달된다
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://example.com/api/v1/users/me/get/profile?source=client");
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe(payload);

    const headers = init?.headers as Headers;
    expect(headers.get("content-type")).toBe("application/json");
    expect(headers.get("cookie")).toBe("authorization=client-token");
    expect(headers.get("authorization")).toBe("Bearer server-token");
  });

  it("GET 요청은 바디를 전달하지 않아야 함", async () => {
    // Given: GET 요청
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://example.com";

    const { cookies } = await import("next/headers");
    const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
    const mockCookies = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as Awaited<ReturnType<typeof cookies>>;
    cookiesMock.mockResolvedValue(mockCookies);

    const { forwardUserRequest } = await import("@/app/api/users/_proxy");
    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const request = new Request("http://localhost/api/users/me/role?scope=me", {
      method: "GET",
    });

    // When: 프록시 요청 수행
    await forwardUserRequest(request, "/api/v1/users/me/role");

    // Then: 바디 없이 요청한다
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://example.com/api/v1/users/me/role?scope=me");
    expect(init?.body).toBeUndefined();
  });
});
