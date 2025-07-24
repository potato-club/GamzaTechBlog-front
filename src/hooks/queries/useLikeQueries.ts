import { likeService } from '@/services/likeService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { POST_QUERY_KEYS } from './usePostQueries';

/**
 * 좋아요 추가 뮤테이션 훅
 */
export function useAddLike(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => likeService.addLike(postId),
    onSuccess: () => {
      // 게시글 데이터 무효화하여 최신 좋아요 수 반영
      queryClient.invalidateQueries({
        queryKey: POST_QUERY_KEYS.detail(postId)
      });
    },
    onError: (error) => {
      console.error('좋아요 추가 실패:', error);
    }
  });
}

/**
 * 좋아요 취소 뮤테이션 훅
 */
export function useRemoveLike(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => likeService.removeLike(postId),
    onSuccess: () => {
      // 게시글 데이터 무효화하여 최신 좋아요 수 반영
      queryClient.invalidateQueries({
        queryKey: POST_QUERY_KEYS.detail(postId)
      });
    },
    onError: (error) => {
      console.error('좋아요 취소 실패:', error);
    }
  });
}
