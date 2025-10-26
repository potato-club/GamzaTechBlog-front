/**
 * 댓글 관련 변경 작업 훅들 (Mutations)
 *
 * 책임: 댓글 데이터 변경 (쓰기 전용)
 * 댓글 등록, 삭제 등의 기능을 TanStack Query로 구현하여
 * 효율적인 상태 관리와 UI 업데이트를 제공합니다.
 */

import { revalidatePostAction } from "@/app/actions/revalidate";
import type {
  CommentRequest,
  CommentResponse,
  PostDetailResponse,
  UserProfileResponse,
} from "@/generated/api";
import { withOptimisticUpdate } from "@/lib/query-utils/optimisticHelpers";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { POST_QUERY_KEYS } from "../../posts/hooks/usePostQueries";
import { USER_QUERY_KEYS } from "../../user/hooks/useUserQueries";
import { commentService } from "../services";

/**
 * 댓글을 등록하는 뮤테이션 훅
 *
 * 낙관적 업데이트를 통해 즉각적인 UI 반응을 제공하고,
 * 서버 ISR 캐시도 무효화하여 최신 상태를 유지합니다.
 *
 * @param postId - 댓글을 작성할 게시글의 ID
 * @param options - React Query mutation 옵션
 */
export function useCreateComment(
  postId: number,
  options?: UseMutationOptions<CommentResponse, Error, CommentRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentRequest: CommentRequest) =>
      commentService.registerComment(postId, commentRequest),

    ...withOptimisticUpdate<CommentRequest, PostDetailResponse>({
      queryClient,
      queryKey: POST_QUERY_KEYS.detail(postId),
      updateCache: (oldData, newComment) => {
        // 현재 사용자 프로필 정보 가져오기
        const userProfile = queryClient.getQueryData<UserProfileResponse>(
          USER_QUERY_KEYS.profile()
        );

        // 임시 댓글 생성
        const optimisticComment: CommentResponse = {
          commentId: Date.now(), // 임시 ID
          writer: userProfile?.nickname ?? "Me",
          writerProfileImageUrl: userProfile?.profileImageUrl ?? "/profileSVG.svg",
          content: newComment.content,
          createdAt: new Date(),
        };

        return {
          ...oldData,
          comments: Array.isArray(oldData.comments)
            ? [optimisticComment, ...oldData.comments]
            : [optimisticComment],
        };
      },
    }),

    onSuccess: (data, variables, context) => {
      // 서버 ISR 캐시 무효화 (백그라운드에서 실행)
      void revalidatePostAction(postId).catch((error) => {
        console.error("Failed to revalidate post:", error);
      });

      options?.onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("댓글 등록 실패:", error);
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}

/**
 * 댓글을 삭제하는 뮤테이션 훅
 *
 * 낙관적 업데이트를 통해 즉각적인 UI 반응을 제공하고,
 * 서버 ISR 캐시도 무효화하여 최신 상태를 유지합니다.
 *
 * @param postId - 댓글이 속한 게시글의 ID
 * @param options - React Query mutation 옵션
 */
export function useDeleteComment(
  postId: number,
  options?: UseMutationOptions<void, Error, number>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentService.deleteComment,

    ...withOptimisticUpdate<number, PostDetailResponse>({
      queryClient,
      queryKey: POST_QUERY_KEYS.detail(postId),
      updateCache: (oldData, commentId) => ({
        ...oldData,
        comments: oldData.comments?.filter((comment) => comment.commentId !== commentId),
      }),
    }),

    onSuccess: (data, commentId, context) => {
      // 서버 ISR 캐시 무효화 (백그라운드에서 실행)
      void revalidatePostAction(postId).catch((error) => {
        console.error("Failed to revalidate post:", error);
      });

      console.log("댓글 삭제 성공:", commentId);
      options?.onSuccess?.(data, commentId, context);
    },

    onError: (error, commentId, context) => {
      console.error("댓글 삭제 실패:", error);
      options?.onError?.(error, commentId, context);
    },

    ...options,
  });
}

/**
 * 댓글 관련 캐시를 수동으로 관리하는 유틸리티 훅
 *
 * 특수한 경우에 캐시를 직접 조작해야 할 때 사용합니다.
 */
export function useCommentUtils(postId: number) {
  const queryClient = useQueryClient();

  const invalidateComments = () => {
    queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
  };

  const addCommentToCache = (newComment: CommentResponse) => {
    queryClient.setQueryData<PostDetailResponse | undefined>(
      POST_QUERY_KEYS.detail(postId),
      (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: [...(old.comments || []), newComment],
        };
      }
    );
  };

  const removeCommentFromCache = (commentId: number) => {
    queryClient.setQueryData<PostDetailResponse | undefined>(
      POST_QUERY_KEYS.detail(postId),
      (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: old.comments?.filter((comment) => comment.commentId !== commentId),
        };
      }
    );
  };

  return {
    invalidateComments,
    addCommentToCache,
    removeCommentFromCache,
  };
}
