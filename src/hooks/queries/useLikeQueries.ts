import { likeService } from '@/services/likeService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { POST_QUERY_KEYS } from './usePostQueries';

// 좋아요 관련 Query Key
export const LIKE_QUERY_KEYS = {
  all: ['likes'] as const,
  status: (postId: number) => [...LIKE_QUERY_KEYS.all, 'status', postId] as const,
} as const;

/**
 * 특정 게시글의 좋아요 상태를 확인하는 쿼리 훅
 */
export function useLikeStatus(postId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: LIKE_QUERY_KEYS.status(postId),
    queryFn: () => likeService.checkLikeStatus(postId),
    enabled: enabled && !!postId, // 로그인 상태이고 postId가 있을 때만 실행
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    retry: 1, // 에러 시 1회만 재시도
  });
}

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
      // 좋아요 상태 쿼리도 무효화
      queryClient.invalidateQueries({
        queryKey: LIKE_QUERY_KEYS.status(postId)
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
      // 좋아요 상태 쿼리도 무효화
      queryClient.invalidateQueries({
        queryKey: LIKE_QUERY_KEYS.status(postId)
      });
    },
    onError: (error) => {
      console.error('좋아요 취소 실패:', error);
    }
  });
}
