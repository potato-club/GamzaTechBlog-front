import type { ProfileImageResponse } from "@/generated/api";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { userService } from "../services/userService";

/**
 * 프로필 이미지를 업로드하는 뮤테이션 훅
 */
export function useUpdateProfileImage(
  options?: UseMutationOptions<ProfileImageResponse, Error, File>
) {
  return useMutation({
    mutationFn: (imageFile: File) => userService.updateProfileImage(imageFile),
    onSuccess: (imageUrl, variables, context) => {
      console.log("프로필 이미지 업로드 성공:", imageUrl);
      options?.onSuccess?.(imageUrl, variables, context);
    },
    onError: (error, variables, context) => {
      console.error("프로필 이미지 업로드 실패:", error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
