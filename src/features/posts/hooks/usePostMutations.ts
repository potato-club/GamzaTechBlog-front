"use client";

import { createPostAction, deletePostAction, updatePostAction } from "@/app/actions/postActions";
import type { PostResponse } from "@/generated/api";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type {
  ActionResult,
  CreatePostInput,
  DeletePostInput,
  UpdatePostInput,
} from "../actions/types";
import { POST_QUERY_KEYS } from "./usePostQueries";

/**
 * 게시글 생성 훅
 *
 * Server Action을 React Query로 래핑하여:
 * - 로딩 상태 자동 관리
 * - 에러 처리
 * - 클라이언트 캐시 무효화
 * - 낙관적 업데이트 지원 (옵션)
 *
 * @param options - React Query mutation 옵션
 * @returns Mutation 객체
 */
export function useCreatePost(
  options?: UseMutationOptions<ActionResult<PostResponse>, Error, CreatePostInput>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostAction,

    onSuccess: (result, variables, context) => {
      if (result.success) {
        // 클라이언트 캐시 무효화 - React Query 캐시 갱신
        queryClient.invalidateQueries({
          queryKey: POST_QUERY_KEYS.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: ["my-posts"],
        });
      }

      options?.onSuccess?.(result, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("게시글 생성 실패:", error);
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}

/**
 * 게시글 삭제 훅
 *
 * @param options - React Query mutation 옵션
 * @returns Mutation 객체
 */
export function useDeletePost(
  options?: UseMutationOptions<ActionResult<void>, Error, DeletePostInput>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostAction,

    onSuccess: (result, variables, context) => {
      if (result.success) {
        // 삭제된 게시글 관련 모든 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: POST_QUERY_KEYS.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: POST_QUERY_KEYS.detail(variables.postId),
        });
        queryClient.invalidateQueries({
          queryKey: ["my-posts"],
        });
      }

      options?.onSuccess?.(result, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("게시글 삭제 실패:", error);
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}

/**
 * 게시글 수정 훅
 *
 * @param options - React Query mutation 옵션
 * @returns Mutation 객체
 */
export function useUpdatePost(
  options?: UseMutationOptions<ActionResult<PostResponse>, Error, UpdatePostInput>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePostAction,

    onSuccess: (result, variables, context) => {
      if (result.success) {
        // 수정된 게시글 관련 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: POST_QUERY_KEYS.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: POST_QUERY_KEYS.detail(variables.postId),
        });
        queryClient.invalidateQueries({
          queryKey: ["my-posts"],
        });
      }

      options?.onSuccess?.(result, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("게시글 수정 실패:", error);
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}
