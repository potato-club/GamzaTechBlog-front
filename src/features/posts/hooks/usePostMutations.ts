"use client";

import {
  createPostAction,
  deletePostAction,
  updatePostAction,
} from "@/features/posts/actions/postActions";
import type { PostResponse } from "@/generated/orval/models";
import { useActionMutation, type ActionMutationOptions } from "@/lib/useActionMutation";
import type {
  ActionResult,
  CreatePostInput,
  DeletePostInput,
  UpdatePostInput,
} from "../actions/types";

/**
 * 게시글 생성 훅
 *
 * Server Action 기반으로:
 * - 로딩 상태 관리
 * - 에러 처리
 *
 * @param options - 성공/실패 콜백 옵션
 * @returns Mutation 객체
 */
export function useCreatePost(
  options?: ActionMutationOptions<ActionResult<PostResponse>, CreatePostInput>
) {
  return useActionMutation<ActionResult<PostResponse>, CreatePostInput>(
    (input) => createPostAction(input),
    {
      onSuccess: (result, variables) => {
        options?.onSuccess?.(result, variables);
      },
      onError: (error, variables) => {
        console.error("게시글 생성 실패:", error);
        options?.onError?.(error, variables);
      },
      onSettled: (data, error, variables) => {
        options?.onSettled?.(data, error, variables);
      },
    }
  );
}

/**
 * 게시글 삭제 훅
 *
 * @param options - 성공/실패 콜백 옵션
 * @returns Mutation 객체
 */
export function useDeletePost(
  options?: ActionMutationOptions<ActionResult<void>, DeletePostInput>
) {
  return useActionMutation<ActionResult<void>, DeletePostInput>(
    (input) => deletePostAction(input),
    {
      onSuccess: (result, variables) => {
        options?.onSuccess?.(result, variables);
      },
      onError: (error, variables) => {
        console.error("게시글 삭제 실패:", error);
        options?.onError?.(error, variables);
      },
      onSettled: (data, error, variables) => {
        options?.onSettled?.(data, error, variables);
      },
    }
  );
}

/**
 * 게시글 수정 훅
 *
 * @param options - 성공/실패 콜백 옵션
 * @returns Mutation 객체
 */
export function useUpdatePost(
  options?: ActionMutationOptions<ActionResult<PostResponse>, UpdatePostInput>
) {
  return useActionMutation<ActionResult<PostResponse>, UpdatePostInput>(
    (input) => updatePostAction(input),
    {
      onSuccess: (result, variables) => {
        options?.onSuccess?.(result, variables);
      },
      onError: (error, variables) => {
        console.error("게시글 수정 실패:", error);
        options?.onError?.(error, variables);
      },
      onSettled: (data, error, variables) => {
        options?.onSettled?.(data, error, variables);
      },
    }
  );
}
