/**
 * forwardPostRequest 테스트
 *
 * 모듈이 로드 시점에 API_BASE_URL을 캐싱하므로,
 * 각 테스트마다 jest.resetModules()로 모듈을 리셋하고 동적 임포트합니다.
 */

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("forwardPostRequest", () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    if (originalBaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_API_BASE_URL = originalBaseUrl;
    }
    jest.restoreAllMocks();
  });

  it("BASE URL이 없으면 500을 반환해야 함", async () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;

    const { forwardPostRequest } = await import("@/app/api/posts/_proxy");
    const request = new Request("http://localhost/api/posts/images", { method: "POST" });

    const response = await forwardPostRequest(request, "/api/v1/posts/images");
    expect(response.status).toBe(500);
  });

  it("메서드/헤더/바디를 그대로 전달해야 함", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://example.com";

    const { cookies } = await import("next/headers");
    const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
    const mockCookies = {
      get: jest.fn().mockReturnValue({ name: "authorization", value: "server-token" }),
    } as unknown as Awaited<ReturnType<typeof cookies>>;
    cookiesMock.mockResolvedValue(mockCookies);

    const { forwardPostRequest } = await import("@/app/api/posts/_proxy");

    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const payload = JSON.stringify({ title: "demo" });
    const request = new Request("http://localhost/api/posts/images?from=test", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "authorization=token",
        authorization: "Bearer token",
      },
      body: payload,
    });

    await forwardPostRequest(request, "/api/v1/posts/images");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://example.com/api/v1/posts/images?from=test");
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe(payload);

    const headers = init?.headers as Headers;
    expect(headers.get("cookie")).toBe("authorization=token");
    expect(headers.get("authorization")).toBe("Bearer token");
    expect(headers.get("content-type")).toBe("application/json");
  });

  it("Authorization 헤더가 없으면 서버 쿠키 토큰을 주입해야 함", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://example.com";

    const { cookies } = await import("next/headers");
    const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
    const mockCookies = {
      get: jest.fn().mockReturnValue({ name: "authorization", value: "server-token" }),
    } as unknown as Awaited<ReturnType<typeof cookies>>;
    cookiesMock.mockResolvedValue(mockCookies);

    const { forwardPostRequest } = await import("@/app/api/posts/_proxy");

    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const request = new Request("http://localhost/api/posts/images", {
      method: "POST",
      headers: {
        cookie: "authorization=token",
      },
      body: "{}",
    });

    await forwardPostRequest(request, "/api/v1/posts/images");

    const [, init] = fetchMock.mock.calls[0];
    const headers = init?.headers as Headers;
    expect(headers.get("authorization")).toBe("Bearer server-token");
  });

  it("GET 요청은 바디를 전달하지 않아야 함", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://example.com";

    const { cookies } = await import("next/headers");
    const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
    const mockCookies = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as Awaited<ReturnType<typeof cookies>>;
    cookiesMock.mockResolvedValue(mockCookies);

    const { forwardPostRequest } = await import("@/app/api/posts/_proxy");

    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const request = new Request("http://localhost/api/posts/images", { method: "GET" });

    await forwardPostRequest(request, "/api/v1/posts/images");

    const [, init] = fetchMock.mock.calls[0];
    expect(init?.body).toBeUndefined();
  });

  it("폼데이터 요청은 FormData로 전달해야 함", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://example.com";

    const { cookies } = await import("next/headers");
    const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
    const mockCookies = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as Awaited<ReturnType<typeof cookies>>;
    cookiesMock.mockResolvedValue(mockCookies);

    const { forwardPostRequest } = await import("@/app/api/posts/_proxy");

    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const formData = new FormData();
    formData.append("file", new Blob(["demo"], { type: "text/plain" }), "demo.txt");

    const headers = new Headers({
      "content-type": "multipart/form-data; boundary=----test",
    });
    const request = {
      url: "http://localhost/api/posts/images",
      method: "POST",
      headers,
      formData: jest.fn().mockResolvedValue(formData),
      text: jest.fn(),
    } as unknown as Request;

    await forwardPostRequest(request, "/api/v1/posts/images");

    const [, init] = fetchMock.mock.calls[0];
    expect(init?.body).toBeInstanceOf(FormData);

    const sentHeaders = init?.headers as Headers;
    expect(sentHeaders.get("content-type")).toBeNull();
  });
});
