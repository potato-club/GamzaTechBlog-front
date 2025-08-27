"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

/**
 * 쿠키 기반 자동 세션 생성 컴포넌트
 * SessionSynchronizer를 대체하는 단순화된 버전
 */
export default function AutoSessionManager() {
  const { data: session, status } = useSession();
  const isProcessingRef = useRef(false);

  useEffect(() => {
    // 이미 세션이 있거나 로딩 중이거나 처리 중이면 실행하지 않음
    if (status === "loading" || status === "authenticated" || isProcessingRef.current) {
      return;
    }

    // authorization 쿠키 확인
    const authCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authorization="))
      ?.split("=")[1];

    if (authCookie && !session) {
      console.log("AutoSessionManager: Found auth cookie but no session, creating session...");
      isProcessingRef.current = true;

      const createSession = async () => {
        try {
          // 사용자 프로필 조회
          const profileResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/me/get/profile`,
            {
              headers: {
                Authorization: `Bearer ${authCookie}`,
              },
              credentials: "include",
            }
          );

          if (profileResponse.ok) {
            const userProfile = await profileResponse.json();

            if (userProfile?.data) {
              console.log("AutoSessionManager: User profile fetched, signing in...");

              const signInResult = await signIn("credentials", {
                authorization: authCookie,
                userProfile: JSON.stringify(userProfile.data),
                redirect: false,
              });

              if (signInResult?.ok) {
                console.log("AutoSessionManager: Session created successfully");
              } else {
                console.error("AutoSessionManager: SignIn failed:", signInResult?.error);
              }
            }
          } else {
            console.log("AutoSessionManager: Invalid token, clearing cookie");
            // 유효하지 않은 토큰이면 쿠키 정리
            document.cookie = "authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }
        } catch (error) {
          console.error("AutoSessionManager: Error creating session:", error);
        } finally {
          isProcessingRef.current = false;
        }
      };

      createSession();
    }
  }, [status, session]);

  return null;
}
