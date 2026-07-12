jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("serverApiClient", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue(new Response(null, { status: 200 }));
  });

  it("publicFetch는 쿠키를 읽지 않아야 함 (공개 조회 → 정적화 가능)", async () => {
    // Given
    const { cookies } = await import("next/headers");
    const { publicFetch } = await import("@/lib/serverApiClient");

    // When
    await publicFetch("https://api.test/api/v1/posts/1");

    // Then: 공용 경로는 쿠키 컨텍스트에 접근하지 않는다 → 라우트를 동적화하지 않음
    expect(cookies).not.toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("publicFetch는 Authorization 헤더를 붙이지 않아야 함", async () => {
    // Given
    const { publicFetch } = await import("@/lib/serverApiClient");

    // When
    await publicFetch("https://api.test/api/v1/posts/1");

    // Then
    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    const headers = new Headers(init?.headers);
    expect(headers.has("Authorization")).toBe(false);
  });

  it("backendFetch는 여전히 쿠키를 읽어 토큰을 첨부해야 함 (개인화 조회용, 회귀 방지)", async () => {
    // Given
    const { cookies } = await import("next/headers");
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "access-token" }),
    });
    const { backendFetch } = await import("@/lib/serverApiClient");

    // When
    await backendFetch("https://api.test/api/v1/users/me");

    // Then
    expect(cookies).toHaveBeenCalled();
    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    const headers = new Headers(init?.headers);
    expect(headers.get("Authorization")).toBe("Bearer access-token");
  });
});
