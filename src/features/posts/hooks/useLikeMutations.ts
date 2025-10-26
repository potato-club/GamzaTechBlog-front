/**
 * 좋아요 관련 변경 작업 훅들 (Mutations)
 *
 * 책임: 좋아요 데이터 변경 (쓰기 전용)
 * 읽기 작업은 useLikeQueries.ts 참조
 */

import { revalidatePostAction } from "@/app/actions/revalidate";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { PostDetailResponse } from "../../../generated/api";
import { likeService } from "../services/likeService";
import { LIKE_QUERY_KEYS } from "./useLikeQueries";
import { POST_QUERY_KEYS } from "./usePostQueries";

/**
 * 좋아요 추가 뮤테이션 훅
 *
 * 낙관적 업데이트를 통해 즉각적인 UI 반응을 제공하고,
 * 실패 시 자동으로 이전 상태로 롤백합니다.
 *
 * @param postId - 좋아요를 추가할 게시글 ID
 * @param options - React Query mutation 옵션
 */
export function useAddLike(postId: number, options?: UseMutationOptions<void, Error, void>) {
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

    onSuccess: (data, variables, context) => {
      // 서버 ISR 캐시 무효화 (백그라운드에서 실행)
      void revalidatePostAction(postId).catch((error) => {
        console.error("Failed to revalidate post:", error);
      });

      options?.onSuccess?.(data, variables, context);
    },

    // 실패 시: 이전 상태로 롤백
    onError: (error, variables, context) => {
      console.error("좋아요 추가 실패:", error);

      // 백업된 데이터로 롤백
      if (context) {
        queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), context.previousPostDetail);
        queryClient.setQueryData(LIKE_QUERY_KEYS.status(postId), context.previousLikeStatus);
      }

      options?.onError?.(error, variables, context);
    },

    // 완료 시: 관련 쿼리 다시 가져오기 (데이터 동기화)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      queryClient.invalidateQueries({ queryKey: LIKE_QUERY_KEYS.status(postId) });
    },

    ...options,
  });
}

/**
 * 좋아요 취소 뮤테이션 훅
 *
 * 낙관적 업데이트를 통해 즉각적인 UI 반응을 제공하고,
 * 실패 시 자동으로 이전 상태로 롤백합니다.
 *
 * @param postId - 좋아요를 취소할 게시글 ID
 * @param options - React Query mutation 옵션
 */
export function useRemoveLike(postId: number, options?: UseMutationOptions<void, Error, void>) {
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

    onSuccess: (data, variables, context) => {
      // 서버 ISR 캐시 무효화 (백그라운드에서 실행)
      void revalidatePostAction(postId).catch((error) => {
        console.error("Failed to revalidate post:", error);
      });

      options?.onSuccess?.(data, variables, context);
    },

    // 실패 시: 이전 상태로 롤백
    onError: (error, variables, context) => {
      console.error("좋아요 취소 실패:", error);

      // 백업된 데이터로 롤백
      if (context) {
        queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), context.previousPostDetail);
        queryClient.setQueryData(LIKE_QUERY_KEYS.status(postId), context.previousLikeStatus);
      }

      options?.onError?.(error, variables, context);
    },

    // 완료 시: 관련 쿼리 다시 가져오기 (데이터 동기화)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      queryClient.invalidateQueries({ queryKey: LIKE_QUERY_KEYS.status(postId) });
    },

    ...options,
  });
}
