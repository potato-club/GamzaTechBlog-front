import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PostDetailResponse } from "../../../generated/api";
import { likeService } from "../services/likeService";
import { POST_QUERY_KEYS } from "./usePostQueries";

// 좋아요 관련 Query Key
export const LIKE_QUERY_KEYS = {
  all: ["likes"] as const,
  status: (postId: number) => [...LIKE_QUERY_KEYS.all, "status", postId] as const,
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
 * 좋아요 추가 뮤테이션 훅 (낙관적 업데이트 포함)
 */
export function useAddLike(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => likeService.addLike(postId),

    // 낙관적 업데이트: 서버 응답 전에 UI 즉시 업데이트
    onMutate: async () => {
      // 진행 중인 쿼리들을 취소하여 낙관적 업데이트와 충돌 방지
      await queryClient.cancelQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      await queryClient.cancelQueries({ queryKey: LIKE_QUERY_KEYS.status(postId) });

      // 현재 캐시된 데이터를 백업 (롤백용)
      const previousPostDetail = queryClient.getQueryData(POST_QUERY_KEYS.detail(postId));
      const previousLikeStatus = queryClient.getQueryData(LIKE_QUERY_KEYS.status(postId));

      // 게시글 상세 정보의 좋아요 수 증가
      queryClient.setQueryData(
        POST_QUERY_KEYS.detail(postId),
        (old: PostDetailResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            likesCount: (old.likesCount || 0) + 1,
          };
        }
      );

      // 좋아요 상태를 true로 설정
      queryClient.setQueryData(LIKE_QUERY_KEYS.status(postId), true);

      return { previousPostDetail, previousLikeStatus };
    },

    onSuccess: () => {
      // 성공 시 추가 작업 없음 (이미 낙관적으로 업데이트됨)
    },

    // 실패 시: 이전 상태로 롤백
    onError: (error, variables, context) => {
      console.error("좋아요 추가 실패:", error);

      // 백업된 데이터로 롤백
      if (context?.previousPostDetail !== undefined) {
        queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), context.previousPostDetail);
      }
      if (context?.previousLikeStatus !== undefined) {
        queryClient.setQueryData(LIKE_QUERY_KEYS.status(postId), context.previousLikeStatus);
      }
    },

    // 완료 시: 관련 쿼리 다시 가져오기 (데이터 동기화)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      queryClient.invalidateQueries({ queryKey: LIKE_QUERY_KEYS.status(postId) });
    },
  });
}

/**
 * 좋아요 취소 뮤테이션 훅 (낙관적 업데이트 포함)
 */
export function useRemoveLike(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => likeService.removeLike(postId),

    // 낙관적 업데이트: 서버 응답 전에 UI 즉시 업데이트
    onMutate: async () => {
      // 진행 중인 쿼리들을 취소하여 낙관적 업데이트와 충돌 방지
      await queryClient.cancelQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      await queryClient.cancelQueries({ queryKey: LIKE_QUERY_KEYS.status(postId) });

      // 현재 캐시된 데이터를 백업 (롤백용)
      const previousPostDetail = queryClient.getQueryData(POST_QUERY_KEYS.detail(postId));
      const previousLikeStatus = queryClient.getQueryData(LIKE_QUERY_KEYS.status(postId));

      // 게시글 상세 정보의 좋아요 수 감소
      queryClient.setQueryData(
        POST_QUERY_KEYS.detail(postId),
        (old: PostDetailResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            likesCount: Math.max((old.likesCount || 0) - 1, 0),
          };
        }
      );

      // 좋아요 상태를 false로 설정
      queryClient.setQueryData(LIKE_QUERY_KEYS.status(postId), false);

      return { previousPostDetail, previousLikeStatus };
    },

    onSuccess: () => {
      // 성공 시 추가 작업 없음 (이미 낙관적으로 업데이트됨)
    },

    // 실패 시: 이전 상태로 롤백
    onError: (error, variables, context) => {
      console.error("좋아요 취소 실패:", error);

      // 백업된 데이터로 롤백
      if (context?.previousPostDetail !== undefined) {
        queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), context.previousPostDetail);
      }
      if (context?.previousLikeStatus !== undefined) {
        queryClient.setQueryData(LIKE_QUERY_KEYS.status(postId), context.previousLikeStatus);
      }
    },

    // 완료 시: 관련 쿼리 다시 가져오기 (데이터 동기화)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      queryClient.invalidateQueries({ queryKey: LIKE_QUERY_KEYS.status(postId) });
    },
  });
}
