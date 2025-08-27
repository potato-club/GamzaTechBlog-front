import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 클라이언트에서 HttpOnly refreshToken의 유효성을 확인하고 새로운 토큰을 발급받는 API
 *
 * 주요 책임:
 * 1. HttpOnly refreshToken 유효성 검증
 * 2. 백엔드 reissue API 호출 및 응답 중계
 * 3. 만료된 토큰 정리
 *
 * 사용처: SessionSynchronizer (자동 로그인 시도)
 */
export async function POST() {
  try {
    console.warn("Token refresh API called");

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    console.warn("RefreshToken found:", !!refreshToken);
    console.warn("RefreshToken value:", refreshToken);

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "No refresh token available",
        },
        { status: 401 }
      ); // 인증 관련 실패는 401이 더 적합합니다.
    }

    // 백엔드에 토큰 재발급 요청 (서버-투-서버 통신)
    console.warn("Requesting token reissue from backend...");

    const reissueResponse = await fetch(`${BASE_URL}/api/auth/reissue`, {
      method: "POST",
      headers: {
        // 백엔드가 받을 수 있도록 정확히 'Cookie' 헤더를 설정합니다.
        // Cookie: `refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJHYW1qYVRlY2giLCJnaXRodWJJZCI6ImdfNjMyODAxMTIiLCJqdGkiOiJiNDc3ZTM1NC0wODY3LTQ0YzctOTg5NC1jMmE2NDFjMjg3OWYiLCJpYXQiOjE3NTU5NTY1MzksImV4cCI6MTc1NjU2MTMzOX0.KakBHLXBFfC7MhHxCcnF6WiTnIqCYs-FpfrFGyOc2ZI`,
        Cookie: `refreshToken=${refreshToken}`,
      },
      // credentials 옵션은 서버 환경에서 효과가 없으므로 제거합니다.
    });

    console.warn("Backend reissue response status:", reissueResponse.status);
    console.warn(
      "Backend reissue response headers:",
      Object.fromEntries(reissueResponse.headers.entries())
    );

    if (!reissueResponse.ok) {
      console.error("Token reissue failed with status:", reissueResponse.status);

      // 에러 시에만 응답 본문 읽기
      try {
        const errorResponse = await reissueResponse.text();
        console.error("Backend error response:", errorResponse);
      } catch (e) {
        console.error("Failed to read error response:", e);
      }

      // 403은 refreshToken이 만료되었음을 의미 (정상적인 상황)
      if (reissueResponse.status === 403) {
        console.warn("Refresh token expired, this is normal for logged-out users");

        // 만료된 쿠키들을 정리하기 위한 응답 헤더 설정
        const response = NextResponse.json({
          success: false,
          message: "Refresh token expired",
          code: "REFRESH_TOKEN_EXPIRED",
        });

        // 만료된 쿠키들을 삭제하도록 설정
        response.cookies.set("refreshToken", "", {
          expires: new Date(0),
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });
        response.cookies.set("authorization", "", {
          expires: new Date(0),
          secure: true,
          sameSite: "lax",
        });

        return response;
      }

      // 다른 에러들
      return NextResponse.json(
        { success: false, message: "Token reissue failed" },
        { status: reissueResponse.status }
      );
    }

    // 백엔드 응답 파싱
    const reissueData = await reissueResponse.json();
    console.warn("Backend reissue response data:", reissueData);

    // response body에서 authorization 토큰 추출
    const newAuthorization = reissueData.data?.authorization;

    // Set-Cookie 헤더도 확인 (새로운 쿠키들이 설정됨)
    const setCookieHeaders = reissueResponse.headers.get("set-cookie");
    console.warn("Set-Cookie headers from backend:", setCookieHeaders);

    // 모든 set-cookie 헤더 확인 (여러 개일 수 있음)
    const allSetCookieHeaders = reissueResponse.headers.getSetCookie?.() || [];
    console.warn("All Set-Cookie headers:", allSetCookieHeaders);

    // 각 쿠키 헤더의 상세 정보 로그
    allSetCookieHeaders.forEach((header, index) => {
      console.warn(`Set-Cookie ${index + 1}:`, header);
      if (header.includes("authorization=")) {
        console.warn(`  -> Authorization cookie detected`);
      }
      if (header.includes("refreshToken=")) {
        console.warn(`  -> RefreshToken cookie detected`);
      }
    });

    // 헤더에서

    if (!newAuthorization) {
      console.error("New authorization token not found in response body");
      return NextResponse.json(
        {
          success: false,
          message: "New authorization token not found",
        },
        { status: 500 }
      );
    }

    console.warn("New authorization token found in response body");

    console.warn("Token reissue successful");

    // 새 토큰으로 사용자 프로필도 미리 조회해서 authorize 함수의 부담을 줄임
    console.warn("Fetching user profile with new token...");
    const profileResponse = await fetch(`${BASE_URL}/api/v1/users/me/get/profile`, {
      headers: {
        Authorization: `Bearer ${newAuthorization}`,
      },
    });

    if (!profileResponse.ok) {
      console.error("Failed to fetch user profile with new token");
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch user profile with new token",
        },
        { status: 500 }
      );
    }

    const userProfile = await profileResponse.json();

    if (!userProfile?.data) {
      console.error("User profile data missing");
      return NextResponse.json(
        {
          success: false,
          message: "User profile data missing",
        },
        { status: 500 }
      );
    }

    console.warn("User profile fetched successfully");

    // JWT에서 만료시간 파싱하여 정확한 maxAge 설정
    let maxAge = 3600; // 기본값 1시간
    try {
      const tokenParts = newAuthorization.split(".");
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString());
        const exp = payload.exp; // Unix timestamp (seconds)
        const now = Math.floor(Date.now() / 1000);
        maxAge = exp - now > 0 ? exp - now : 3600;
        console.warn("Parsed JWT maxAge:", maxAge);
      }
    } catch (e) {
      console.warn("Failed to parse JWT for maxAge, using default:", e);
    }

    // 응답 생성
    const response = NextResponse.json({
      success: true,
      authorization: newAuthorization,
      userProfile: userProfile.data,
      message: "New access token and user profile retrieved",
    });

    // 프로덕션 환경 감지 (Vercel 배포 시)
    const isProduction =
      process.env.NODE_ENV === "production" ||
      process.env.VERCEL_ENV === "production" ||
      process.env.NEXT_PUBLIC_VERCEL_URL?.includes("vercel.app") ||
      process.env.NEXT_PUBLIC_VERCEL_URL?.includes("gamzatech.site");

    console.warn("Environment detection:", {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
      isProduction,
    });

    // 백엔드에서 받은 Set-Cookie 헤더를 그대로 클라이언트에 전달
    if (allSetCookieHeaders.length > 0) {
      console.warn("Forwarding Set-Cookie headers from backend to client");

      // 모든 Set-Cookie 헤더를 응답에 추가
      allSetCookieHeaders.forEach((cookieHeader, index) => {
        console.warn(`Forwarding Set-Cookie ${index + 1}:`, cookieHeader);
        response.headers.append("Set-Cookie", cookieHeader);
      });
    } else {
      // Set-Cookie 헤더가 없는 경우에만 응답 본문의 authorization으로 쿠키 설정
      console.warn("No Set-Cookie headers, setting authorization from response body");

      // authorization 쿠키 설정 (클라이언트에서 접근 가능)
      response.cookies.set("authorization", newAuthorization, {
        path: "/",
        domain: isProduction ? ".gamzatech.site" : undefined,
        maxAge: maxAge,
        secure: isProduction, // 프로덕션에서만 secure
        sameSite: "lax",
        httpOnly: false, // 클라이언트에서 접근 가능해야 함
      });

      console.warn("Authorization cookie set with options:", {
        domain: isProduction ? ".gamzatech.site" : undefined,
        maxAge: maxAge,
        secure: isProduction,
        sameSite: "lax",
        httpOnly: false,
      });
    }

    return response;
  } catch (error) {
    console.error("Token refresh API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
