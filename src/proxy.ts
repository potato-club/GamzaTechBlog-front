import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 알려진 악성 크롤러 / 불필요한 봇 UA 패턴
const BLOCKED_BOT_PATTERNS = [
  /AhrefsBot/i,
  /SemrushBot/i,
  /DotBot/i,
  /MJ12bot/i,
  /BLEXBot/i,
  /DataForSeoBot/i,
  /PetalBot/i,
  /Bytespider/i,
  /GPTBot/i,
  /ClaudeBot/i,
  /anthropic-ai/i,
  /CCBot/i,
  /ChatGPT-User/i,
  /cohere-ai/i,
];

// 캐시를 적용할 공개 페이지 경로
const CACHEABLE_PATHS = [
  /^\/$/,
  /^\/posts\/[^/]+$/,
  /^\/search/,
  /^\/profile\/[^/]+$/,
];

// 토큰 재발급 시도를 건너뛸 경로 (무한 루프 방지)
const REFRESH_SKIP_PATHS = [/^\/api\/auth\/reissue/];

// 만료 n초 전부터 선제적으로 재발급
const TOKEN_REFRESH_BUFFER_SECONDS = 60;

/**
 * JWT payload의 exp 클레임을 디코딩합니다.
 * Edge 런타임에서 동작하도록 atob 사용.
 */
function decodeJwtExp(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // base64url → base64 변환 후 패딩 추가 (JWT는 '=' 패딩 생략)
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded));

    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

/**
 * 백엔드에 토큰 재발급을 요청하고, 성공 시 Set-Cookie 헤더 배열을 반환합니다.
 * 실패하면 null을 반환합니다.
 */
async function reissueToken(request: NextRequest): Promise<string[] | null> {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!backendUrl) return null;

  const cookieHeader = request.headers.get("cookie") ?? "";
  const accessToken = request.cookies.get("authorization")?.value;

  const reqHeaders: Record<string, string> = { cookie: cookieHeader };
  if (accessToken) {
    reqHeaders["authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const res = await fetch(`${backendUrl}/api/auth/reissue`, {
      method: "POST",
      headers: reqHeaders,
    });

    if (!res.ok) return null;

    // Next.js 16 (Node.js 18.18+) / Headers.getSetCookie 지원 여부를 방어적으로 확인 후 사용
    const setCookies =
      typeof (res.headers as { getSetCookie?: () => string[] }).getSetCookie ===
      "function"
        ? (res.headers as { getSetCookie: () => string[] }).getSetCookie()
        : [];

    return setCookies.length > 0 ? setCookies : null;
  } catch {
    return null;
  }
}

/**
 * 공개 페이지에 Vercel Edge Cache 헤더를 적용합니다.
 */
function applyCacheHeaders(response: NextResponse, pathname: string): void {
  const isCacheable = CACHEABLE_PATHS.some((pattern) =>
    pattern.test(pathname)
  );

  if (isCacheable) {
    // s-maxage: CDN(Vercel Edge) 캐시 유지 시간 (1시간)
    // stale-while-revalidate: 백그라운드에서 갱신하는 동안 stale 캐시 제공 (24시간)
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") ?? "";

  // 1. 악성/AI 크롤러 차단
  const isBlockedBot = BLOCKED_BOT_PATTERNS.some((pattern) =>
    pattern.test(userAgent)
  );
  if (isBlockedBot) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2. 토큰 선제적 재발급 (만료 60초 전 ~ 만료 후)
  //    reissue 경로 자체는 스킵하여 무한 루프 방지
  const shouldSkipRefresh = REFRESH_SKIP_PATHS.some((p) => p.test(pathname));

  if (!shouldSkipRefresh) {
    const accessToken = request.cookies.get("authorization")?.value;

    if (accessToken) {
      const exp = decodeJwtExp(accessToken);
      const nowSeconds = Math.floor(Date.now() / 1000);

      if (exp !== null && exp - nowSeconds < TOKEN_REFRESH_BUFFER_SECONDS) {
        const newSetCookies = await reissueToken(request);

        if (newSetCookies) {
          // 재발급 성공: 새 쿠키를 응답에 포함하여 클라이언트에 전달
          // 현재 요청은 구 토큰으로 처리되지만 구 토큰은 아직 유효함
          // 다음 요청부터 새 토큰 사용
          const response = NextResponse.next();
          // Set-Cookie가 포함된 응답은 CDN에 캐시되면 안 됨 (타 사용자에게 쿠키 전달 위험)
          response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
          for (const cookie of newSetCookies) {
            response.headers.append("Set-Cookie", cookie);
          }
          return response;
        }
        // 재발급 실패: 그대로 진행 → 하위 레이어(Server Action, RSC)에서 401 처리
      }
    }
  }

  // 3. API 경로는 캐시 없이 통과
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 4. 페이지 응답에 CDN 캐시 헤더 적용
  const response = NextResponse.next();
  applyCacheHeaders(response, pathname);
  return response;
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 미들웨어 적용:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon, robots, sitemap 등 공개 파일
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2)).*)",
  ],
};
