import { createServerApiClient } from "@/lib/apiClient";
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
 * import { createUserServiceServer } from "@/features/user";
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
  return createUserService(createServerApiClient());
};
