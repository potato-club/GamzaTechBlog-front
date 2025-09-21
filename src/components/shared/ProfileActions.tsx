"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface ProfileActionsProps {
  targetUsername: string;
  mode: "mypage" | "public";
}

/**
 * 프로필 페이지에서 사용되는 액션 버튼들
 *
 * 본인 프로필을 공개 프로필 페이지에서 볼 때 마이페이지로 이동할 수 있는 버튼 제공
 */
export const ProfileActions = ({ targetUsername, mode }: ProfileActionsProps) => {
  const { userProfile } = useAuth();
  const isMyProfile = userProfile?.nickname === targetUsername;

  // 마이페이지에서는 추가 액션 불필요
  if (mode === "mypage") {
    return null;
  }

  // 공개 프로필에서 본인 프로필을 보는 경우
  if (mode === "public" && isMyProfile) {
    return (
      <div className="mt-4 flex justify-center">
        <Link href="/mypage">
          <Button variant="outline" size="sm">
            마이페이지로 이동
          </Button>
        </Link>
      </div>
    );
  }

  return null;
};
