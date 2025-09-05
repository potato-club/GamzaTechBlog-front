import type { ProfileImageResponse, UserProfileResponse } from "@/generated/api";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { USER_QUERY_KEYS } from "./useUserQueries";

// 뮤테이션 컨텍스트 타입 정의
interface UpdateProfileImageContext {
  previousProfile: UserProfileResponse | undefined;
  tempImageUrl: string;
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
