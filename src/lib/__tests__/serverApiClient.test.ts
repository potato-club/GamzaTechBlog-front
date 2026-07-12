jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("serverApiClient", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue(new Response(null, { status: 200 }));
  });

  it("backendFetch는 쿠키를 읽어 토큰을 첨부해야 함 (개인화 조회용)", async () => {
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
