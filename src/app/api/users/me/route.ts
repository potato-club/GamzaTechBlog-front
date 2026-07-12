import { createUserServiceServer } from "@/features/user/services/userService.server";
import type { UserProfileResponse } from "@/generated/api/models";
import { NextResponse } from "next/server";

/**
 * 현재 로그인 사용자 조회 BFF 라우트
 *
 * 클라이언트(AuthProvider)가 마운트 후 이 엔드포인트로 인증 상태를 부트스트랩한다.
 * 토큰(authorization 쿠키) 취급을 서버에 격리하기 위해 존재한다 —
 * 개인화 조회를 루트 레이아웃(서버 렌더)에서 빼야 페이지 라우트가 정적화(ISR)되기 때문이다.
 *
 * 응답: { role: string | null, profile: UserProfileResponse | null }
 */
export async function GET(): Promise<NextResponse> {
  const userService = createUserServiceServer();

  // getUserRole은 내부적으로 예외를 삼키고 null을 반환한다(비로그인 등)
  const role = await userService.getUserRole({ cache: "no-store" });

  if (!role || role === "PRE_REGISTER") {
    return NextResponse.json({ role: role ?? null, profile: null });
  }

  let profile: UserProfileResponse | null = null;
  try {
    profile = await userService.getProfile({ cache: "no-store" });
  } catch (error) {
    console.warn(
      "Profile fetch failed in /api/users/me:",
      error instanceof Error ? `${error.name}: ${error.message}` : String(error)
    );
  }

  return NextResponse.json({ role, profile });
}
