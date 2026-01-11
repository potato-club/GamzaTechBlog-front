/**
 * 사용자 관련 변경 작업 훅들 (Mutations)
 *
 * 책임: 사용자 데이터 변경 (쓰기 전용)
 * 읽기 작업은 서버 컴포넌트에서 처리
 *
 * NOTE: BFF 마이그레이션으로 프로필 데이터는 서버 컴포넌트에서만 fetch됩니다.
 * 따라서 React Query 캐시 대신 router.refresh()로 서버 데이터를 갱신합니다.
 */

import type {
  ProfileImageResponse,
  UpdateProfileRequest,
  UserProfileRequest,
  UserProfileResponse,
} from "@/generated/api";
import type { ActionResult } from "@/lib/actionResult";
import { handleTokenExpiration } from "@/lib/tokenManager";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  updateProfileAction,
  updateProfileImageAction,
  updateProfileInSignupAction,
  withdrawAccountAction,
} from "../actions/userActions";

/**
 * 프로필 이미지를 업로드하는 뮤테이션 훅
 *
 * 서버 컴포넌트에서 프로필을 fetch하므로 성공 시 router.refresh()로 갱신합니다.
 */
export function useUpdateProfileImage(
  options?: UseMutationOptions<ActionResult<ProfileImageResponse>, Error, File>
) {
  const router = useRouter();

  return useMutation({
    mutationFn: (imageFile: File) => updateProfileImageAction(imageFile),

    onSuccess: (result, variables, context) => {
      if (result.success) {
        // 서버 컴포넌트 리렌더링으로 프로필 이미지 갱신
        router.refresh();
      } else {
        console.error("프로필 이미지 업로드 실패:", result.error);
      }

      options?.onSuccess?.(result, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("프로필 이미지 업로드 실패:", error);
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}

/**
 * 회원가입 시 프로필을 업데이트하는 뮤테이션 훅
 *
 * 회원가입 플로우에서 사용되며, 프로필 정보를 설정합니다.
 * 회원가입 후 리다이렉트되므로 router.refresh()는 불필요합니다.
 */
export function useUpdateProfileInSignup(
  options?: UseMutationOptions<ActionResult<UserProfileResponse>, Error, UserProfileRequest>
) {
  return useMutation({
    mutationFn: (profileData: UserProfileRequest) => updateProfileInSignupAction(profileData),

    onSuccess: (result, variables, context) => {
      if (!result.success) {
        console.error("프로필 업데이트 실패:", result.error);
      }

      options?.onSuccess?.(result, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("프로필 업데이트 실패:", error);
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}

/**
 * 사용자 프로필을 업데이트하는 뮤테이션 훅
 *
 * 서버 컴포넌트에서 프로필을 fetch하므로 성공 시 router.refresh()로 갱신합니다.
 */
export function useUpdateProfile(
  options?: UseMutationOptions<ActionResult<UserProfileResponse>, Error, UpdateProfileRequest>
) {
  const router = useRouter();

  return useMutation({
    mutationFn: (profileData: UpdateProfileRequest) => updateProfileAction(profileData),

    onSuccess: (result, variables, context) => {
      if (result.success) {
        // 서버 컴포넌트 리렌더링으로 프로필 갱신
        router.refresh();
      } else {
        console.error("프로필 업데이트 실패:", result.error);
      }

      options?.onSuccess?.(result, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("프로필 업데이트 실패:", error);
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}

/**
 * 계정 탈퇴 뮤테이션 훅
 *
 * 계정 탈퇴 후 자동으로 로그아웃 처리하고 홈으로 리다이렉트합니다.
 */
export function useWithdrawAccount(options?: UseMutationOptions<ActionResult<void>, Error, void>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => withdrawAccountAction(),

    onSuccess: (result, variables, context) => {
      if (result.success) {
        // 토큰 만료 처리 및 홈으로 리다이렉트
        handleTokenExpiration(queryClient, "/");
      }

      options?.onSuccess?.(result, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("계정 탈퇴 실패:", error);
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}
