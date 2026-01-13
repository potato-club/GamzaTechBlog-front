/**
 * 공개 프로필 페이지 (서버 컴포넌트)
 *
 * 사용자명을 통해 공개 프로필을 조회하고 표시합니다.
 * ProfileLayout을 public 모드로 사용하여 마이페이지와 일관된 UI를 제공합니다.
 *
 * @param params - 동적 라우팅 매개변수 { username: string }
 */

import ProfileLayout from "@/components/shared/layout/ProfileLayout";
import { getPublicUser } from "@/features/user/services/userService.server";
import { notFound } from "next/navigation";

interface PublicProfilePageProps {
  params: Promise<{
    username: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PublicProfilePageProps) {
  const { username } = await params;
  const userProfile = await getPublicUser(username);

  if (!userProfile) {
    return {
      title: "사용자를 찾을 수 없습니다",
    };
  }

  return {
    title: `${userProfile.profile?.nickname}님의 프로필`,
    description: `${userProfile.profile?.nickname}님이 작성한 게시글을 확인해보세요.`,
  };
}

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({ params, searchParams }: PublicProfilePageProps) {
  const { username } = await params;
  const resolvedSearchParams = await searchParams;

  const userProfile = await getPublicUser(username);

  if (!userProfile) {
    notFound();
  }

  return <ProfileLayout mode="public" username={username} searchParams={resolvedSearchParams} />;
}
