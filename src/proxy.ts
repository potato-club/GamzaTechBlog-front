import { decodeJwt, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js proxy - 라우트 보호 및 인증 처리
 *
 * 보호된 경로에 대한 서버 레벨 접근 제어를 제공합니다.
 * JWT 토큰 검증을 통해 인증되지 않은 사용자의 접근을 차단합니다.
 */

// 보호된 경로 패턴 정의
const PROTECTED_ROUTES = {
  // 관리자 권한이 필요한 경로
  ADMIN_REQUIRED: ["/admin"],
} as const;

// 인증 페이지 경로 (로그인된 사용자는 접근 불가)
const AUTH_PAGES = ["/signup"] as const;

const REFRESH_BUFFER_MS = 60 * 1000;

interface UserJWTPayload {
  sub: string;
  githubId: string;
  jti: string;
  iat: number;
  exp: number;
}

/**
 * JWT 토큰을 검증하고 사용자 정보를 반환합니다.
 */
async function verifyToken(token: string): Promise<UserJWTPayload | null> {
  try {
    const jwtSecret = process.env.JWT_SECRET_KEY;
    if (!jwtSecret) {
      console.error("JWT_SECRET_KEY is not defined in environment variables");
      return null;
    }

    // Secret key 처리 (base64 인코딩 여부 확인)
    let secret: Uint8Array;
    if (jwtSecret.endsWith("=") || /^[A-Za-z0-9+/]*={0,2}$/.test(jwtSecret)) {
      secret = new Uint8Array(Buffer.from(jwtSecret, "base64"));
    } else {
      secret = new TextEncoder().encode(jwtSecret);
    }

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256", "HS384", "HS512"],
    });

    return payload as unknown as UserJWTPayload;
  } catch (error) {
    console.warn("JWT verification failed in proxy:", error);
    return null;
  }
}

async function refreshAccessToken(request: NextRequest): Promise<Response | null> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  if (!apiBaseUrl) {
    console.warn("NEXT_PUBLIC_API_BASE_URL is not configured");
    return null;
  }

  try {
    const cookie = request.headers.get("cookie");
    const headers = new Headers();

    if (cookie) {
      headers.set("cookie", cookie);
    }

    const response = await fetch(`${apiBaseUrl}/api/auth/reissue`, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      return null;
    }

    return response;
  } catch (error) {
    console.warn("Failed to refresh access token in proxy:", error);
    return null;
  }
}

function isTokenNearExpiry(token: string): boolean {
  try {
    const payload = decodeJwt(token);
    if (!payload.exp) return false;
    const expiryTime = payload.exp * 1000;
    return expiryTime < Date.now() + REFRESH_BUFFER_MS;
  } catch (error) {
    console.warn("Failed to decode JWT in proxy:", error);
    return false;
  }
}

/**
 * 경로가 특정 패턴과 일치하는지 확인합니다.
 */
function matchesRoute(pathname: string, patterns: readonly string[]): boolean {
  return patterns.some((pattern) => {
    // 와일드카드(*) 패턴을 정규표현식으로 변환
    const regexPattern = pattern.replace(/\*/g, "[^/]+");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  });
}

/**
 * 사용자 역할을 API를 통해 확인합니다.
 */
async function getUserRole(token: string): Promise<string | null> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const response = await fetch(`${apiBaseUrl}/api/users/role`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.warn("Failed to fetch user role:", error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일 및 API 경로는 proxy 스킵
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("authorization")?.value;
  const isAuthPage = matchesRoute(pathname, AUTH_PAGES);
  const requiresAdmin = matchesRoute(pathname, PROTECTED_ROUTES.ADMIN_REQUIRED);

  if (token && isTokenNearExpiry(token)) {
    const refreshResponse = await refreshAccessToken(request);
    if (refreshResponse) {
      const response = NextResponse.next();
      const setCookie = refreshResponse.headers.get("set-cookie");
      if (setCookie) {
        response.headers.set("set-cookie", setCookie);
      }
      return response;
    }
  }

  // 1. 토큰이 없는 경우
  if (!token) {
    return NextResponse.next();
  }

  // 2. 토큰 검증
  const user = await verifyToken(token);
  if (!user) {
    // 토큰이 유효하지 않은 경우 쿠키 삭제 후 다음 처리로 진행
    const response = NextResponse.next();
    response.cookies.delete("authorization");
    return response;
  }

  const userRole = await getUserRole(token);

  // 3. 추가 정보 입력 전 사용자는 /signup만 허용
  if (userRole === "PRE_REGISTER") {
    if (pathname !== "/signup") {
      return NextResponse.redirect(new URL("/signup", request.url));
    }
    return NextResponse.next();
  }

  // 4. 로그인된 사용자가 인증 페이지에 접근하는 경우
  if (isAuthPage) {
    if (pathname === "/signup" && !userRole) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 5. 관리자 권한이 필요한 경로 체크
  if (requiresAdmin) {
    if (userRole !== "ADMIN") {
      // 관리자가 아닌 경우 403 페이지로 리다이렉트
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  // 6. 모든 검증 통과
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
     * - public files with extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
