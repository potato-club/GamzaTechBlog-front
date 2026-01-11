/**
 * 마이페이지 메인 컴포넌트 (서버 컴포넌트)
 *
 * 서버 컴포넌트로 빠른 초기 렌더링을 제공합니다.
 * 대시보드 loading.tsx에서 페이지 레벨 로딩 UI를 담당하므로
 * 추가적인 Suspense fallback은 불필요합니다.
 *
 * ProfileLayout을 사용하여 공개 프로필 페이지와 일관된 구조를 유지합니다.
 */

import { ProfileLayout } from "@/components/shared";
import { createUserServiceServer } from "@/features/user/services/userService.server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface MyPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function MyPage({ searchParams }: MyPageProps) {
  console.log("Rendering MyPage Server Component");

  const cookieStore = await cookies();
  const token = cookieStore.get("authorization")?.value;
  if (!token) {
    const loginUrl = process.env.NEXT_PUBLIC_OAUTH_LOGIN_URL || "/api/auth/github";
    redirect(loginUrl);
  }

  // 인증 상태 확인 - User Service 사용
  try {
    const userService = createUserServiceServer();
    await userService.getProfile({ cache: "no-store" });
  } catch (error) {
    console.error("Authentication failed:", error);
  }

  return <ProfileLayout mode="mypage" searchParams={searchParams} />;
}
