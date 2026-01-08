import "server-only";

import { createBackendApiClient } from "@/lib/serverApiClient";
import type { Pageable, UserProfileResponse, UserPublicProfileResponse } from "@/generated/api";
import { createUserService } from "./userService.shared";

/**
 * 서버 전용 User Service 팩토리 함수
 *
 * 서버 컴포넌트, Server Actions, Route Handlers에서 사용합니다.
 * next/headers의 cookies()를 통해 현재 요청의 쿠키를 자동으로 포함합니다.
 *
 * @returns User Service 인스턴스
 *
 * @example
 * ```tsx
 * // 서버 컴포넌트에서 사용
 * import { createUserServiceServer } from "@/features/user/services/userService.server";
 *
 * export default async function MyPage() {
 *   const userService = createUserServiceServer();
 *   const profile = await userService.getProfile();
 *   return <div>{profile.nickname}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // ISR/SSG with revalidate
 * const userService = createUserServiceServer();
 * const profile = await userService.getProfile({
 *   next: { revalidate: 3600 }
 * });
 * ```
 */
export const createUserServiceServer = () => {
  return createUserService(createBackendApiClient());
};

/**
 * 서버 컴포넌트/액션에서 현재 사용자 정보를 조회합니다.
 */
export async function getCurrentUser(): Promise<UserProfileResponse | null> {
  try {
    const userService = createUserServiceServer();
    return await userService.getProfile();
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

/**
 * 서버 컴포넌트에서 공개 프로필 정보를 조회합니다.
 */
export async function getPublicUser(
  nickname: string,
  params?: Pageable
): Promise<UserPublicProfileResponse | null> {
  try {
    const userService = createUserServiceServer();
    return await userService.getPublicProfile(nickname, params);
  } catch (error) {
    console.error(`Failed to get public user profile for ${nickname}:`, error);
    return null;
  }
}
