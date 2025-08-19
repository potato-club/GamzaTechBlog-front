"use client";

import { getCookie } from "cookies-next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * 백엔드 인증 쿠키와 Auth.js 세션을 동기화하는 클라이언트 컴포넌트.
 * UI를 렌더링하지 않습니다.
 */
export default function SessionSynchronizer() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const authorization = getCookie("authorization");
    // refreshToken은 HttpOnly이므로 클라이언트에서 직접 읽지 않습니다.
    // 서버의 authorize 콜백에서 req.cookies를 통해 접근합니다.

    // Auth.js 세션이 없고 (unauthenticated), authorization 쿠키가 있는 경우
    if (status === "unauthenticated" && authorization) {
      // Auth.js의 Credentials 플로우를 트리거하여 세션을 생성합니다.
      // `authorize` 함수가 실행되어 쿠키를 기반으로 사용자 프로필을 가져옵니다.
      signIn("credentials", {
        authorization,
        redirect: false,
      });
    }

    // 세션에 "RefreshAccessTokenError"가 발생한 경우
    // 이는 JWT 콜백에서 리프레시 토큰이 만료되었거나 유효하지 않음을 의미합니다.
    if (session?.error === "RefreshAccessTokenError") {
      // Auth.js 세션을 종료하고 사용자를 로그아웃시킵니다.
      signOut();
    }
  }, [status, session]);

  // 이 컴포넌트는 UI를 렌더링하지 않습니다.
  return null;
}
