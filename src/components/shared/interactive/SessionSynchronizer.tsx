"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

/**
 * 백엔드 인증 쿠키와 Auth.js 세션을 동기화하는 클라이언트 컴포넌트.
 * UI를 렌더링하지 않습니다.
 */
export default function SessionSynchronizer() {
  const { data: session, status } = useSession();
  const isAttemptingLoginRef = useRef(false);

  console.log("SessionSynchronizer: Component mounted/re-rendered", {
    status,
    hasSession: !!session,
  });

  useEffect(() => {
    console.log("SessionSynchronizer: useEffect triggered", {
      status,
      isAttempting: isAttemptingLoginRef.current,
    });

    // 로딩 중이거나 이미 로그인 시도 중이거나 인증된 상태라면 실행하지 않음
    if (status === "loading" || status === "authenticated" || isAttemptingLoginRef.current) {
      console.log("SessionSynchronizer: Skipping auto-login attempt", {
        status,
        isAttempting: isAttemptingLoginRef.current,
      });
      return;
    }

    console.log("SessionSynchronizer: No NextAuth session found, checking for refresh token...");
    isAttemptingLoginRef.current = true;

    const attemptAutoLogin = async () => {
      try {
        console.log(
          "SessionSynchronizer: Attempting to get new access token from refresh token..."
        );

        // 라우트 핸들러를 통해 HttpOnly refreshToken으로 새 accessToken 발급
        const response = await fetch("/api/auth/session-check", {
          method: "POST",
          credentials: "include", // HttpOnly 쿠키 포함
        });

        const result = await response.json();
        console.log("Token refresh result:", result);

        if (!response.ok) {
          console.log("Token refresh failed:", response.status, result.message);

          // refreshToken이 만료된 경우는 정상적인 상황 (로그인하지 않은 상태)
          if (result.code === "REFRESH_TOKEN_EXPIRED") {
            console.log(
              "SessionSynchronizer: Refresh token expired - user is not logged in (this is normal)"
            );
            console.log("SessionSynchronizer: Cleaning up expired cookies...");

            // 현재 쿠키 상태 확인
            console.log("SessionSynchronizer: Current cookies before cleanup:", document.cookie);

            // 만료된 쿠키들을 정리 (클라이언트에서 접근 가능한 쿠키만)
            // authorization 쿠키는 일반 쿠키이므로 클라이언트에서 삭제 가능
            // 여러 가지 방법으로 확실히 삭제
            document.cookie = "authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
              window.location.hostname +
              ";";
            document.cookie = "authorization=; max-age=0; path=/;";

            console.log("SessionSynchronizer: Authorization cookie deletion attempted");
            console.log("SessionSynchronizer: Current cookies after cleanup:", document.cookie);

            // 현재 페이지가 홈페이지가 아니거나 에러 쿼리가 있는 경우에만 리디렉션
            const currentPath = window.location.pathname;
            const hasErrorQuery = window.location.search.includes("error=session_expired");

            if (currentPath !== "/" || hasErrorQuery) {
              console.log("SessionSynchronizer: Redirecting to home page...");
              window.location.href = "/";
            } else {
              console.log("SessionSynchronizer: Already on home page, cleanup completed");
            }
            return;
          }

          // 다른 에러들은 로그만 출력
          console.error("Unexpected token refresh error:", result);
          return;
        }

        if (result.success && result.authorization) {
          console.log("New access token and user profile received, signing in with NextAuth...");

          // 쿠키 업데이트 확인을 위한 짧은 대기
          await new Promise((resolve) => setTimeout(resolve, 100));

          // 현재 브라우저 쿠키 상태 확인
          console.log("SessionSynchronizer: Current cookies after token refresh:", document.cookie);

          // authorization 쿠키가 실제로 업데이트되었는지 확인
          const authCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("authorization="));

          if (authCookie) {
            const cookieValue = authCookie.split("=")[1];
            console.log(
              "SessionSynchronizer: Authorization cookie found:",
              cookieValue.substring(0, 20) + "..."
            );

            // 새로운 토큰과 쿠키의 토큰이 일치하는지 확인
            if (cookieValue === result.authorization) {
              console.log("SessionSynchronizer: Cookie successfully updated with new token");
            } else {
              console.warn("SessionSynchronizer: Cookie token mismatch - forcing cookie update");
              console.warn("Expected:", result.authorization.substring(0, 20) + "...");
              console.warn("Found in cookie:", cookieValue.substring(0, 20) + "...");

              // 클라이언트에서 강제로 쿠키 업데이트 (JWT 만료시간 사용)
              const isProduction = window.location.hostname.includes("gamzatech.site");

              // JWT에서 만료시간 파싱
              let maxAge = 3600; // 기본값
              try {
                const tokenParts = result.authorization.split(".");
                if (tokenParts.length === 3) {
                  const payload = JSON.parse(atob(tokenParts[1]));
                  const exp = payload.exp; // Unix timestamp (seconds)
                  const now = Math.floor(Date.now() / 1000);
                  maxAge = exp - now > 0 ? exp - now : 3600;
                  console.log("SessionSynchronizer: Parsed JWT maxAge:", maxAge);
                }
              } catch (error) {
                console.warn("SessionSynchronizer: Failed to parse JWT, using default maxAge");
              }

              const cookieString = `authorization=${result.authorization}; path=/; max-age=${maxAge}; secure; samesite=lax${isProduction ? "; domain=.gamzatech.site" : ""}`;
              document.cookie = cookieString;
              console.log("SessionSynchronizer: Forced cookie update with:", cookieString);
            }
          } else {
            console.warn(
              "SessionSynchronizer: Authorization cookie not found after refresh - setting cookie"
            );

            // 쿠키가 아예 없는 경우 클라이언트에서 설정 (JWT 만료시간 사용)
            const isProduction = window.location.hostname.includes("gamzatech.site");

            // JWT에서 만료시간 파싱
            let maxAge = 3600; // 기본값
            try {
              const tokenParts = result.authorization.split(".");
              if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                const exp = payload.exp; // Unix timestamp (seconds)
                const now = Math.floor(Date.now() / 1000);
                maxAge = exp - now > 0 ? exp - now : 3600;
                console.log("SessionSynchronizer: Parsed JWT maxAge:", maxAge);
              }
            } catch (error) {
              console.warn("SessionSynchronizer: Failed to parse JWT, using default maxAge");
            }

            const cookieString = `authorization=${result.authorization}; path=/; max-age=${maxAge}; secure; samesite=lax${isProduction ? "; domain=.gamzatech.site" : ""}`;
            document.cookie = cookieString;
            console.log("SessionSynchronizer: Set authorization cookie:", cookieString);
          }

          // 새로운 accessToken과 사용자 프로필로 NextAuth signIn 호출
          // authorize 함수는 이미 조회된 프로필 정보를 사용하여 User 객체만 생성하면 됨
          const signInResult = await signIn("credentials", {
            authorization: result.authorization,
            userProfile: JSON.stringify(result.userProfile), // 프로필 정보도 함께 전달
            redirect: false,
          });

          if (signInResult?.ok) {
            console.log("NextAuth session created successfully");
          } else {
            console.error("NextAuth signIn failed:", signInResult?.error);
          }
        } else {
          console.log("No valid refresh token available:", result.message);
        }
      } catch (error) {
        console.error("Auto login failed:", error);
      } finally {
        isAttemptingLoginRef.current = false;
      }
    };

    attemptAutoLogin();
  }, [status]);

  // RefreshAccessTokenError 처리
  useEffect(() => {
    console.log("SessionSynchronizer: Current session state:", {
      status,
      error: session?.error,
      hasSession: !!session,
    });

    if (session?.error === "RefreshAccessTokenError") {
      console.log("RefreshAccessTokenError detected, signing out and redirecting to home...");
      signOut({
        callbackUrl: "/?error=session_expired",
        redirect: true,
      });
    }
  }, [session?.error, status]);

  return null;
}
