import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./src/auth";

/**
 * 단순화된 미들웨어 - 보호된 경로 접근 제어만 담당
 * 세션 생성은 클라이언트에서 처리
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API 라우트와 정적 파일은 제외
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/auth/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 보호된 경로 확인
  const protectedPaths = ["/admin"];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath) {
    console.log("Middleware: Checking auth for protected path:", pathname);

    const session = await auth();
    const authCookie = request.cookies.get("authorization")?.value;

    // 세션이나 쿠키 중 하나라도 있으면 접근 허용
    if (!session && !authCookie) {
      console.log("Middleware: No auth found, redirecting to home");
      return NextResponse.redirect(new URL("/?error=auth_required", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
