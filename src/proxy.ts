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
      typeof (res.headers as { getSetCookie?: () => string[] }).getSetCookie === "function"
        ? (res.headers as { getSetCookie: () => string[] }).getSetCookie()
        : [];

    return setCookies.length > 0 ? setCookies : null;
  } catch {
    return null;
  }
}

type SetCookieMutation = {
  name: string;
  value: string;
  shouldDelete: boolean;
};

function parseSetCookieMutation(setCookie: string): SetCookieMutation | null {
  const [nameValue, ...attributes] = setCookie.split(";");
  const separatorIndex = nameValue.indexOf("=");

  if (separatorIndex === -1) return null;

  const name = nameValue.slice(0, separatorIndex).trim();
  const value = nameValue.slice(separatorIndex + 1).trim();

  if (!name) return null;

  const normalizedAttributes = attributes.map((attribute) => attribute.trim());
  const maxAgeAttribute = normalizedAttributes.find((attribute) =>
    attribute.toLowerCase().startsWith("max-age=")
  );
  const expiresAttribute = normalizedAttributes.find((attribute) =>
    attribute.toLowerCase().startsWith("expires=")
  );
  const maxAge = maxAgeAttribute
    ? Number.parseInt(maxAgeAttribute.slice("max-age=".length), 10)
    : null;
  const expiresAt = expiresAttribute
    ? Date.parse(expiresAttribute.slice("expires=".length))
    : Number.NaN;
  const shouldDelete =
    value === "" ||
    (maxAge !== null && Number.isFinite(maxAge) && maxAge <= 0) ||
    (!Number.isNaN(expiresAt) && expiresAt <= Date.now());

  return { name, value, shouldDelete };
}

export function buildForwardedRequestHeaders(request: NextRequest, setCookies: string[]): Headers {
  const forwardedHeaders = new Headers(request.headers);
  const requestCookies = new Map(
    request.cookies.getAll().map((cookie) => [cookie.name, cookie.value])
  );

  for (const setCookie of setCookies) {
    const mutation = parseSetCookieMutation(setCookie);
    if (!mutation) continue;

    if (mutation.shouldDelete) {
      requestCookies.delete(mutation.name);
      continue;
    }

    requestCookies.set(mutation.name, mutation.value);
  }

  if (requestCookies.size > 0) {
    forwardedHeaders.set(
      "cookie",
      Array.from(requestCookies.entries())
        .map(([name, value]) => `${name}=${value}`)
        .join("; ")
    );
  } else {
    forwardedHeaders.delete("cookie");
  }

  const refreshedAccessToken = requestCookies.get("authorization");
  if (!request.headers.has("authorization")) {
    if (refreshedAccessToken) {
      forwardedHeaders.set("authorization", `Bearer ${refreshedAccessToken}`);
    } else {
      forwardedHeaders.delete("authorization");
    }
  }

  return forwardedHeaders;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") ?? "";

  // 1. 악성/AI 크롤러 차단
  const isBlockedBot = BLOCKED_BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
  if (isBlockedBot) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2. 토큰 선제적 재발급 (만료 60초 전 ~ 만료 후)
  const accessToken = request.cookies.get("authorization")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const shouldAttemptReissue = (() => {
    if (!refreshToken) return false;
    if (!accessToken) return true;

    const exp = decodeJwtExp(accessToken);
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (exp === null) return true;
    return exp - nowSeconds < TOKEN_REFRESH_BUFFER_SECONDS;
  })();

  if (shouldAttemptReissue) {
    const newSetCookies = await reissueToken(request);

    if (newSetCookies) {
      const forwardedHeaders = buildForwardedRequestHeaders(request, newSetCookies);
      // 재발급 성공: 새 쿠키를 응답에 포함하고 현재 요청에도 반영하여
      // 같은 요청 내 Server Component / Route Handler와 auth 상태를 일치시킴
      const response = NextResponse.next({
        request: {
          headers: forwardedHeaders,
        },
      });
      // Set-Cookie가 포함된 응답은 CDN에 캐시되면 안 됨 (타 사용자에게 쿠키 전달 위험)
      response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
      for (const cookie of newSetCookies) {
        response.headers.append("Set-Cookie", cookie);
      }
      return response;
    }
    // 재발급 실패: 그대로 진행 → 하위 레이어(Server Action, RSC)에서 401 처리
  }

  // 3. API 경로는 캐시 없이 통과
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 4. 일반 페이지는 downstream 응답의 성공/실패를 알 수 없으므로
  // middleware 단계에서 public 캐시 헤더를 강제하지 않는다.
  return NextResponse.next();
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
