import type { ProfileImageResponse } from "@/generated/api";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { imageService } from "../services/imageService";

/**
 * 이미지 업로드 뮤테이션 훅
 * Toast Editor의 addImageBlobHook에서 사용하기 위한 훅
 */
export function useImageUpload() {
  return useMutation({
    mutationFn: (file: File) => imageService.uploadImage(file),
    onError: (error) => {
      console.error("이미지 업로드 실패:", error);
    },
  });
}

/**
 * addImageBlobHook에서 사용할 이미지 업로드 함수
 * Promise를 반환하여 Toast Editor에서 사용 가능
 */
export async function uploadImageForEditor(
  blob: Blob,
  callback: (url: string, altText?: string) => void
) {
  try {
    // Blob을 File 객체로 변환
    const file = new File([blob], "image.png", { type: blob.type });

    // 이미지 업로드
    const imageUrl = await imageService.uploadImage(file);

    // Toast Editor 콜백 함수 호출
    callback(imageUrl, "Uploaded Image");
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
  }
}

/**
 * 프로필 이미지를 업로드하는 뮤테이션 훅
 */
export function useUpdateProfileImage(
  options?: UseMutationOptions<ProfileImageResponse, Error, File>
) {
  return useMutation({
    mutationFn: (imageFile: File) => imageService.updateProfileImage(imageFile),
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
