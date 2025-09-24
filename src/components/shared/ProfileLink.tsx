"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { ReactNode } from "react";

interface ProfileLinkProps {
  nickname: string;
  children: ReactNode;
  className?: string;
  showTooltip?: boolean;
}

/**
 * 프로필 링크 컴포넌트
 *
 * 본인 프로필인 경우 /mypage로, 타인 프로필인 경우 /profile/[nickname]으로 이동
 * 일관된 UX를 제공하기 위한 조건부 라우팅 구현
 */
export const ProfileLink = ({
  nickname,
  children,
  className,
  showTooltip = false,
}: ProfileLinkProps) => {
  const { userProfile } = useAuth();
  const isMyProfile = userProfile?.nickname === nickname;

  // 본인 프로필이면 마이페이지로, 타인이면 공개 프로필로
  const href = isMyProfile ? "/mypage" : `/profile/${nickname}`;
  const tooltipText = isMyProfile ? "마이페이지로 이동" : `${nickname}의 프로필 보기`;

  return (
    <Link href={href} className={className} title={showTooltip ? tooltipText : undefined}>
      {children}
    </Link>
  );
};
