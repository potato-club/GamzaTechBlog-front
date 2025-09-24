"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProfileRedirectProps {
  targetUsername: string;
}

/**
 * 공개 프로필 페이지에서 본인 프로필 접근 시 마이페이지로 자동 리다이렉트
 *
 * URL을 직접 입력하거나 링크로 접근한 경우에도 일관된 UX 제공
 */
export const ProfileRedirect = ({ targetUsername }: ProfileRedirectProps) => {
  const { userProfile, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 로딩이 완료되고 본인 프로필인 경우 마이페이지로 리다이렉트
    if (!isLoading && userProfile?.nickname === targetUsername) {
      router.replace("/mypage");
    }
  }, [isLoading, userProfile?.nickname, targetUsername]);

  // 로딩 중이거나 리다이렉트 처리 중에는 아무것도 렌더링하지 않음
  return null;
};
