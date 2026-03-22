import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

// --- 헬퍼 ---

/** 특정 exp를 가진 테스트용 JWT 생성 (서명은 가짜) */
function makeJwt(exp: number): string {
  const toBase64url = (obj: object) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  const header = toBase64url({ alg: "HS256", typ: "JWT" });
  const payload = toBase64url({ sub: "1", exp });
  return `${header}.${payload}.fake_sig`;
}

/** 만료 임박 토큰 (now + 30초, 버퍼 60초 이내) */
function nearExpiryToken() {
  return makeJwt(Math.floor(Date.now() / 1000) + 30);
}

/** 충분히 유효한 토큰 (now + 10분) */
function validToken() {
  return makeJwt(Math.floor(Date.now() / 1000) + 600);
}

function makeRequest(
  path: string,
  options: { ua?: string; token?: string } = {}
): NextRequest {
  const headers: Record<string, string> = {
    "user-agent": options.ua ?? "Mozilla/5.0",
  };
  if (options.token) {
    headers["cookie"] = `authorization=${options.token}`;
  }
  return new NextRequest(`http://localhost${path}`, { headers });
}

// --- 테스트 ---

describe("proxy", () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
    jest.spyOn(global, "fetch").mockResolvedValue(new Response(null, { status: 401 }));
  });

  afterEach(() => {
    if (originalBaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_API_BASE_URL = originalBaseUrl;
    }
    jest.restoreAllMocks();
  });

  // ── 봇 차단 ────────────────────────────────────────────────

  describe("봇 차단", () => {
    it.each([
      ["AhrefsBot", "AhrefsBot/7.0"],
      ["GPTBot", "GPTBot/1.0"],
      ["ClaudeBot", "ClaudeBot/1.0"],
      ["anthropic-ai", "anthropic-ai/1.0"],
    ])("%s UA는 403을 반환해야 함", async (_, ua) => {
      const req = makeRequest("/", { ua });
      const res = await proxy(req);
      expect(res.status).toBe(403);
    });

    it("일반 브라우저 UA는 차단하지 않아야 함", async () => {
      const req = makeRequest("/", { ua: "Mozilla/5.0 Chrome/120" });
      const res = await proxy(req);
      expect(res.status).not.toBe(403);
    });
  });

  // ── JWT exp 디코딩 ──────────────────────────────────────────

  describe("JWT exp 디코딩 (decodeJwtExp 간접 검증)", () => {
    it("base64url 패딩 없는 토큰도 정상 디코딩해야 함", async () => {
      // 패딩이 없는 base64url payload를 직접 조합
      // sub 길이에 따라 패딩 필요 여부가 달라지므로 다양한 exp 값 검증
      const exp = Math.floor(Date.now() / 1000) + 600;
      const token = makeJwt(exp);
      // 토큰이 유효하면 재발급 시도를 하지 않음 (fetch 호출 없음)
      const req = makeRequest("/", { token });
      await proxy(req);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("만료 임박 토큰은 재발급을 시도해야 함", async () => {
      const req = makeRequest("/", { token: nearExpiryToken() });
      await proxy(req);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/reissue"),
        expect.objectContaining({ method: "POST" })
      );
    });

    it("JWT 형식이 아닌 토큰은 재발급 시도 없이 통과해야 함", async () => {
      const req = makeRequest("/", { token: "not-a-jwt" });
      await proxy(req);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // ── 토큰 재발급 흐름 ────────────────────────────────────────

  describe("토큰 재발급", () => {
    it("토큰이 없으면 재발급 시도 없이 통과해야 함", async () => {
      const req = makeRequest("/");
      await proxy(req);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("토큰이 충분히 유효하면 재발급 시도 없이 통과해야 함", async () => {
      const req = makeRequest("/", { token: validToken() });
      await proxy(req);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("재발급 성공 시 Set-Cookie 헤더를 응답에 포함해야 함", async () => {
      const setCookieValue = "authorization=new_token; HttpOnly; Path=/";
      // new Response()는 내부적으로 Headers를 복사하므로 getSetCookie가 소실됨
      // → fetch 반환값을 raw 객체로 직접 모킹하여 getSetCookie를 보존
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        headers: { getSetCookie: () => [setCookieValue] },
      } as unknown as Response);

      const req = makeRequest("/", { token: nearExpiryToken() });
      const res = await proxy(req);

      expect(res.headers.get("set-cookie")).toContain("authorization=new_token");
    });

    it("재발급 성공 시 Cache-Control: private, no-store를 설정해야 함", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        headers: { getSetCookie: () => ["authorization=new_token; HttpOnly; Path=/"] },
      } as unknown as Response);

      const req = makeRequest("/", { token: nearExpiryToken() });
      const res = await proxy(req);

      expect(res.headers.get("cache-control")).toContain("no-store");
      expect(res.headers.get("cache-control")).not.toContain("public");
    });

    it("재발급 API가 실패해도 요청은 그대로 통과해야 함", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue(new Response(null, { status: 401 }));

      const req = makeRequest("/", { token: nearExpiryToken() });
      const res = await proxy(req);

      expect(res.status).not.toBe(401);
    });

    it("재발급 API 네트워크 오류 시 요청은 그대로 통과해야 함", async () => {
      jest.spyOn(global, "fetch").mockRejectedValue(new Error("network error"));

      const req = makeRequest("/", { token: nearExpiryToken() });
      // 예외 없이 정상 처리되어야 함
      await expect(proxy(req)).resolves.toBeDefined();
    });

    it("/api/auth/reissue 경로는 재발급 시도를 건너뛰어야 함 (무한 루프 방지)", async () => {
      const req = makeRequest("/api/auth/reissue", { token: nearExpiryToken() });
      await proxy(req);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("재발급 요청에 현재 쿠키와 Authorization 헤더를 포함해야 함", async () => {
      const token = nearExpiryToken();
      jest.spyOn(global, "fetch").mockResolvedValue(new Response(null, { status: 401 }));

      const req = makeRequest("/", { token });
      await proxy(req);

      const [, init] = (global.fetch as jest.Mock).mock.calls[0];
      expect((init.headers as Record<string, string>)["authorization"]).toBe(
        `Bearer ${token}`
      );
      expect((init.headers as Record<string, string>)["cookie"]).toContain(
        `authorization=${token}`
      );
    });
  });

  // ── CDN 캐시 헤더 ───────────────────────────────────────────

  describe("CDN 캐시 헤더", () => {
    it.each([
      ["/", "홈"],
      ["/posts/my-post-slug", "게시글 상세"],
      ["/search", "검색"],
      ["/profile/username", "프로필"],
    ])("%s (%s)는 public 캐시 헤더를 설정해야 함", async (path) => {
      const req = makeRequest(path);
      const res = await proxy(req);
      expect(res.headers.get("cache-control")).toContain("s-maxage=3600");
    });

    it("/dashboard는 캐시 헤더를 설정하지 않아야 함", async () => {
      const req = makeRequest("/dashboard");
      const res = await proxy(req);
      expect(res.headers.get("cache-control")).toBeNull();
    });

    it("API 경로는 캐시 헤더를 설정하지 않아야 함", async () => {
      const req = makeRequest("/api/posts");
      const res = await proxy(req);
      expect(res.headers.get("cache-control")).toBeNull();
    });
  });
});
