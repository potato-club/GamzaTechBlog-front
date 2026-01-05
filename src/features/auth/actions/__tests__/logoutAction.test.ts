import type { Mock } from "jest-mock";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
  headers: jest.fn(),
}));

const originalBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

describe("logoutActions", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = originalBaseUrl;
  });

  it("API 기본 URL이 없으면 예외를 던져야 함", async () => {
    // Given
    process.env.NEXT_PUBLIC_API_BASE_URL = "";
    const { logoutAction } = await import("@/features/auth/actions/logoutAction");

    // When + Then
    await expect(logoutAction()).rejects.toThrow("API base URL is not configured.");
  });

  it("성공 시 헤더를 전달하고 쿠키를 삭제해야 함", async () => {
    // Given
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.test";
    const { cookies, headers } = await import("next/headers");
    const { logoutAction } = await import("@/features/auth/actions/logoutAction");

    const cookieStore = {
      get: jest.fn().mockReturnValue({ value: "access-token" }),
      delete: jest.fn(),
    };
    const headerStore = {
      get: jest.fn().mockReturnValue("refreshToken=abc"),
    };

    (cookies as Mock).mockResolvedValue(cookieStore);
    (headers as Mock).mockResolvedValue(headerStore);
    (global.fetch as Mock).mockResolvedValue(new Response(null, { status: 200 }));

    // When
    await logoutAction();

    // Then
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = (global.fetch as Mock).mock.calls[0];
    expect(url).toBe("https://api.test/api/auth/me/logout");
    expect(options.method).toBe("POST");
    expect(options.redirect).toBe("manual");

    const sentHeaders = options.headers as Headers;
    expect(sentHeaders.get("authorization")).toBe("Bearer access-token");
    expect(sentHeaders.get("cookie")).toBe("refreshToken=abc");

    expect(cookieStore.delete).toHaveBeenCalledWith("authorization");
    expect(cookieStore.delete).toHaveBeenCalledWith("refreshToken");
  });

  it("응답이 실패면 쿠키를 삭제하고 예외를 던져야 함", async () => {
    // Given
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.test";
    const { cookies, headers } = await import("next/headers");
    const { logoutAction } = await import("@/features/auth/actions/logoutAction");

    const cookieStore = {
      get: jest.fn().mockReturnValue({ value: "access-token" }),
      delete: jest.fn(),
    };
    const headerStore = {
      get: jest.fn().mockReturnValue("refreshToken=abc"),
    };

    (cookies as Mock).mockResolvedValue(cookieStore);
    (headers as Mock).mockResolvedValue(headerStore);
    (global.fetch as Mock).mockResolvedValue(new Response(null, { status: 403 }));

    // When + Then
    await expect(logoutAction()).rejects.toThrow("Logout failed");
    expect(cookieStore.delete).toHaveBeenCalledWith("authorization");
    expect(cookieStore.delete).toHaveBeenCalledWith("refreshToken");
  });
});
