"use client";

import { apiClient } from "@/lib/apiClient";
import { getCookie } from "cookies-next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * 백엔드 인증 쿠키와 Auth.js 세션을 동기화하는 클라이언트 컴포넌트.
 * UI를 렌더링하지 않습니다.
 */
export default function SessionSynchronizer() {
  const { data: session, status } = useSession();
  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);

  useEffect(() => {
    // 1. next-auth 세션이 없고, 로딩 중이 아니며, 현재 자동 로그인 시도 중이 아닐 때
    if (status === "unauthenticated" && !isAttemptingLogin) {
      const authorization = getCookie("authorization");

      // 2. authorization 쿠키가 이미 있는 경우 -> 바로 signIn
      if (authorization) {
        setIsAttemptingLogin(true);
        signIn("credentials", {
          authorization,
          redirect: false,
        }).finally(() => setIsAttemptingLogin(false));
      } else {
        // 3. authorization 쿠키가 없는 경우 -> 자동 로그인(프로브 API) 시도
        setIsAttemptingLogin(true);
        // 인증이 필요한 API를 호출하여 apiClient의 재발급 로직을 트리거합니다.
        apiClient
          .getCurrentUserProfile()
          .then(() => {
            // 프로브 API 호출 성공 -> apiClient가 토큰을 재발급하고 쿠키에 저장했음을 의미합니다.
            // 이제 새 쿠키로 signIn을 호출하여 next-auth 세션을 설정합니다.
            const newAuthorization = getCookie("authorization");
            if (newAuthorization) {
              signIn("credentials", {
                authorization: newAuthorization,
                redirect: false,
              });
            }
          })
          .catch((error) => {
            // 재발급 실패는 정상적인 상황일 수 있으므로 콘솔에만 기록합니다.
            if (error) {
              console.log("Auto sign-in failed: Refresh token is invalid or expired.");
            } else {
              console.error("Auto sign-in probe API failed:", error);
            }
          })
          .finally(() => {
            setIsAttemptingLogin(false);
          });
      }
    }

    // 4. 세션에 리프레시 에러가 있는 경우 (예: 다른 탭에서 로그아웃)
    if (session?.error === "RefreshAccessTokenError") {
      signOut();
    }
  }, [status, session, isAttemptingLogin]);

  // 이 컴포넌트는 UI를 렌더링하지 않습니다.
  return null;
}
