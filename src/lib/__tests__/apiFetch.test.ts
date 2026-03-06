const ORIGINAL_ENV = process.env;

describe("apiFetch", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("bff 모드는 path를 그대로 호출해야 함", async () => {
    // Given
    const fetchMock = jest.fn().mockResolvedValue({ ok: true } as Response);
    globalThis.fetch = fetchMock as typeof fetch;
    const { apiFetch } = await import("../apiFetch");

    // When
    await apiFetch("/api/health", { method: "POST" });

    // Then
    expect(fetchMock).toHaveBeenCalledWith("/api/health", { method: "POST" });
  });

  it("direct-public 모드는 base URL과 omit credentials를 사용해야 함", async () => {
    // Given
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
    const fetchMock = jest.fn().mockResolvedValue({ ok: true } as Response);
    globalThis.fetch = fetchMock as typeof fetch;
    const { apiFetch } = await import("../apiFetch");

    // When
    await apiFetch("/v1/posts", { mode: "direct-public" });

    // Then
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/v1/posts", {
      credentials: "omit",
    });
  });

  it("direct-private 모드는 include credentials가 기본이어야 함", async () => {
    // Given
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
    const fetchMock = jest.fn().mockResolvedValue({ ok: true } as Response);
    globalThis.fetch = fetchMock as typeof fetch;
    const { apiFetch } = await import("../apiFetch");

    // When
    await apiFetch("/v1/me", { mode: "direct-private" });

    // Then
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/v1/me", {
      credentials: "include",
    });
  });

  it("direct-private 모드에서 credentials를 명시하면 우선해야 함", async () => {
    // Given
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
    const fetchMock = jest.fn().mockResolvedValue({ ok: true } as Response);
    globalThis.fetch = fetchMock as typeof fetch;
    const { apiFetch } = await import("../apiFetch");

    // When
    await apiFetch("/v1/me", { mode: "direct-private", credentials: "same-origin" });

    // Then
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/v1/me", {
      credentials: "same-origin",
    });
  });

  it("base URL이 없으면 direct 모드에서 에러를 던져야 함", async () => {
    // Given
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    const { apiFetch } = await import("../apiFetch");

    // When / Then
    expect(() => apiFetch("/v1/posts", { mode: "direct-public" })).toThrow(
      "API base URL is not configured."
    );
  });
});
