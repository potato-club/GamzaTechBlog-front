/**
 * 사용자 관련 변경 작업 훅들 (Mutations)
 *
 * 책임: 사용자 데이터 변경 (쓰기 전용)
 * 읽기 작업은 useUserQueries.ts 참조
 */

import type { ProfileImageResponse, UserProfileResponse } from "@/generated/api";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { USER_QUERY_KEYS } from "./useUserQueries";

// 뮤테이션 컨텍스트 타입 정의
interface UpdateProfileImageContext {
  previousProfile: UserProfileResponse | undefined;
  tempImageUrl: string;
}

interface UpdateProfileContext {
  previousProfile: UserProfileResponse | undefined;
}

/**
 * 프로필 이미지를 업로드하는 뮤테이션 훅 (낙관적 업데이트 포함)
 */
export function useUpdateProfileImage(
  options?: UseMutationOptions<ProfileImageResponse, Error, File, UpdateProfileImageContext>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageFile: File) => userService.updateProfileImage(imageFile),

    // 낙관적 업데이트: 서버 응답 전에 UI 즉시 업데이트
    onMutate: async (imageFile: File): Promise<UpdateProfileImageContext> => {
      // 진행 중인 쿼리들을 취소하여 낙관적 업데이트와 충돌 방지
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEYS.profile() });

      // 현재 캐시된 데이터를 백업 (롤백용)
      const previousProfile = queryClient.getQueryData<UserProfileResponse>(
        USER_QUERY_KEYS.profile()
      );

      // 임시 이미지 URL 생성 (미리보기용)
      const tempImageUrl = URL.createObjectURL(imageFile);

      // 낙관적으로 프로필 이미지 업데이트
      if (previousProfile) {
        const optimisticProfile: UserProfileResponse = {
          ...previousProfile,
          profileImageUrl: tempImageUrl,
        };
        queryClient.setQueryData(USER_QUERY_KEYS.profile(), optimisticProfile);
      }

      return { previousProfile, tempImageUrl };
    },

    onSuccess: (imageResponse, variables, context) => {
      console.log("프로필 이미지 업로드 성공:", imageResponse);

      // 임시 URL 정리
      if (context?.tempImageUrl) {
        URL.revokeObjectURL(context.tempImageUrl);
      }

      // 서버에서 받은 실제 이미지 URL로 업데이트
      const currentProfile = queryClient.getQueryData<UserProfileResponse>(
        USER_QUERY_KEYS.profile()
      );
      if (currentProfile) {
        const updatedProfile: UserProfileResponse = {
          ...currentProfile,
          profileImageUrl: imageResponse.imageUrl,
        };
        queryClient.setQueryData(USER_QUERY_KEYS.profile(), updatedProfile);
      }

      options?.onSuccess?.(imageResponse, variables, context);
    },

    // 실패 시: 이전 상태로 롤백
    onError: (error, variables, context) => {
      console.error("프로필 이미지 업로드 실패:", error);

      // 임시 URL 정리
      if (context?.tempImageUrl) {
        URL.revokeObjectURL(context.tempImageUrl);
      }

      // 백업된 데이터로 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(USER_QUERY_KEYS.profile(), context.previousProfile);
      }

      options?.onError?.(error, variables, context);
    },

    // 완료 시: 관련 쿼리 다시 가져오기
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.profile() });
    },

    ...options,
  });
}

/**
 * 회원가입 시 프로필을 업데이트하는 뮤테이션 훅
 *
 * 회원가입 플로우에서 사용되며, 프로필 정보를 설정합니다.
 */
export function useUpdateProfileInSignup(
  options?: UseMutationOptions<UserProfileResponse, Error, UserProfileRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: UserProfileRequest) => userService.updateProfileInSignup(profileData),

    onSuccess: (updatedProfile, variables, context) => {
      // 프로필 캐시 업데이트
      queryClient.setQueryData(USER_QUERY_KEYS.profile(), updatedProfile);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.activityStats() });

      options?.onSuccess?.(updatedProfile, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("프로필 업데이트 실패:", error);
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}

/**
 * 사용자 프로필을 업데이트하는 뮤테이션 훅 (낙관적 업데이트 포함)
 *
 * 낙관적 업데이트를 통해 즉각적인 UI 반응을 제공하고,
 * 실패 시 자동으로 이전 상태로 롤백합니다.
 */
export function useUpdateProfile(
  options?: UseMutationOptions<
    UserProfileResponse,
    Error,
    UpdateProfileRequest,
    UpdateProfileContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: UpdateProfileRequest) => userService.updateProfile(profileData),

    // 낙관적 업데이트: 서버 응답 전에 UI 즉시 업데이트
    onMutate: async (profileData: UpdateProfileRequest): Promise<UpdateProfileContext> => {
      // 진행 중인 쿼리들을 취소하여 낙관적 업데이트와 충돌 방지
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEYS.profile() });

      // 현재 캐시된 데이터를 백업 (롤백용)
      const previousProfile = queryClient.getQueryData<UserProfileResponse>(
        USER_QUERY_KEYS.profile()
      );

      // 낙관적으로 프로필 데이터 업데이트
      if (previousProfile) {
        const optimisticProfile: UserProfileResponse = {
          ...previousProfile,
          ...profileData,
        };
        queryClient.setQueryData(USER_QUERY_KEYS.profile(), optimisticProfile);
      }

      return { previousProfile };
    },

    onSuccess: (updatedProfile, variables, context) => {
      // 서버에서 받은 실제 데이터로 캐시 업데이트
      queryClient.setQueryData(USER_QUERY_KEYS.profile(), updatedProfile);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.activityStats() });

      options?.onSuccess?.(updatedProfile, variables, context);
    },

    // 실패 시: 이전 상태로 롤백
    onError: (error, variables, context) => {
      console.error("프로필 업데이트 실패:", error);

      // 백업된 데이터로 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(USER_QUERY_KEYS.profile(), context.previousProfile);
      }

      options?.onError?.(error, variables, context);
    },

    // 완료 시: 관련 쿼리 다시 가져오기
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.profile() });
    },

    ...options,
  });
}

/**
 * 계정 탈퇴 뮤테이션 훅
 *
 * 계정 탈퇴 후 자동으로 로그아웃 처리하고 홈으로 리다이렉트합니다.
 */
export function useWithdrawAccount(options?: UseMutationOptions<void, Error, void>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.withdrawAccount(),

    onSuccess: (data, variables, context) => {
      // 토큰 만료 처리 및 홈으로 리다이렉트
      handleTokenExpiration(queryClient, "/");

      options?.onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("계정 탈퇴 실패:", error);
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}
