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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") ?? "";

  // 1. 악성/AI 크롤러 차단
  const isBlockedBot = BLOCKED_BOT_PATTERNS.some((pattern) =>
    pattern.test(userAgent)
  );

  if (isBlockedBot) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2. API 경로는 캐시 없이 통과
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // 3. 공개 페이지에 CDN 캐시 헤더 적용 (Vercel Edge Cache 활용)
  // 봇이 같은 페이지를 재방문해도 서버리스 함수 재실행 없이 캐시 반환
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
