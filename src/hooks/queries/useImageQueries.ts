import { imageService } from '@/services/imageService';
import { useMutation } from '@tanstack/react-query';

/**
 * 이미지 업로드 뮤테이션 훅
 * Toast Editor의 addImageBlobHook에서 사용하기 위한 훅
 */
export function useImageUpload() {
  return useMutation({
    mutationFn: (file: File) => imageService.uploadImage(file),
    onError: (error) => {
      console.error('이미지 업로드 실패:', error);
    }
  });
}

/**
 * addImageBlobHook에서 사용할 이미지 업로드 함수
 * Promise를 반환하여 Toast Editor에서 사용 가능
 */
export async function uploadImageForEditor(blob: Blob, callback: (url: string, altText?: string) => void) {
  try {
    // Blob을 File 객체로 변환
    const file = new File([blob], 'image.png', { type: blob.type });

    // 이미지 업로드
    const imageUrl = await imageService.uploadImage(file);

    // Toast Editor 콜백 함수 호출
    callback(imageUrl, 'Uploaded Image');
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
  }
}
