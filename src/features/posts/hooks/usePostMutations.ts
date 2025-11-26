"use client";

import { createPostAction, deletePostAction, updatePostAction } from "@/app/actions/postActions";
import type { PostResponse } from "@/generated/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { POST_QUERY_KEYS } from "./usePostQueries";

/**
 * Mutation 훅 공통 옵션
 * 기본 동작을 오버라이드하고 싶을 때만 사용
 */
interface MutationHookOptions<TData = void> {
  /** 성공 시 이동할 경로 (false: 라우팅 안 함) */
  redirectTo?: ((data: TData) => string) | string | false;
  /** 성공 메시지 */
  successMessage?: string;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 성공 시 추가 동작 (기본 동작 후 실행) */
  onSuccess?: (data: TData) => void | Promise<void>;
  /** 에러 시 추가 동작 */
  onError?: (error: Error) => void;
}

/**
 * 게시글 생성 훅
 *
 * Server Action을 React Query로 래핑하여:
 * - 로딩 상태 자동 관리
 * - 에러 처리
 * - 클라이언트 캐시 무효화
 * - 자동 라우팅 및 Toast 알림
 *
 * @param options - 커스텀 옵션 (선택사항)
 * @returns Mutation 객체
 */
export function useCreatePost(options?: MutationHookOptions<PostResponse>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createPostAction,

    onSuccess: async (result) => {
      if (result.success) {
        // 1. 캐시 무효화
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() });
        queryClient.invalidateQueries({ queryKey: ["my-posts"] });

        // 2. 성공 토스트
        const message = options?.successMessage ?? "게시글이 작성되었습니다.";
        toast.success(message);

        // 3. 사용자 콜백
        await options?.onSuccess?.(result.data);

        // 4. 라우팅
        if (options?.redirectTo !== false) {
          const path =
            typeof options?.redirectTo === "function"
              ? options.redirectTo(result.data)
              : (options?.redirectTo ?? `/posts/${result.data.postId}`);
          router.push(path);
        }
      } else {
        const message =
          options?.errorMessage ?? result.error ?? "게시글 작성 중 오류가 발생했습니다.";
        toast.error(message);
      }
    },

    onError: (error) => {
      console.error("게시글 생성 실패:", error);
      const message = options?.errorMessage ?? "게시글 작성 중 오류가 발생했습니다.";
      toast.error(message);
      options?.onError?.(error);
    },
  });
}

/**
 * 게시글 삭제 훅
 *
 * Server Action을 React Query로 래핑하여:
 * - 로딩 상태 자동 관리
 * - 에러 처리
 * - 클라이언트 캐시 무효화
 * - 자동 라우팅 및 Toast 알림
 *
 * @param options - 커스텀 옵션 (선택사항)
 * @returns Mutation 객체
 */
export function useDeletePost(options?: MutationHookOptions<void>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deletePostAction,

    onSuccess: async (result, variables) => {
      if (result.success) {
        // 1. 캐시 무효화
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() });
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(variables.postId) });
        queryClient.invalidateQueries({ queryKey: ["my-posts"] });

        // 2. 성공 토스트
        const message = options?.successMessage ?? "게시글이 삭제되었습니다.";
        toast.success(message);

        // 3. 사용자 콜백
        await options?.onSuccess?.(undefined);

        // 4. 라우팅
        if (options?.redirectTo !== false) {
          const path = options?.redirectTo ?? "/";
          router.push(path as string);
          router.refresh();
        }
      } else {
        const message =
          options?.errorMessage ?? result.error ?? "게시글 삭제 중 오류가 발생했습니다.";
        toast.error(message);
      }
    },

    onError: (error) => {
      console.error("게시글 삭제 실패:", error);
      const message = options?.errorMessage ?? "게시글 삭제 중 오류가 발생했습니다.";
      toast.error(message);
      options?.onError?.(error);
    },
  });
}

/**
 * 게시글 수정 훅
 *
 * Server Action을 React Query로 래핑하여:
 * - 로딩 상태 자동 관리
 * - 에러 처리
 * - 클라이언트 캐시 무효화
 * - 자동 라우팅 및 Toast 알림
 *
 * @param options - 커스텀 옵션 (선택사항)
 * @returns Mutation 객체
 */
export function useUpdatePost(options?: MutationHookOptions<PostResponse>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updatePostAction,

    onSuccess: async (result, variables) => {
      if (result.success) {
        // 1. 캐시 무효화
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() });
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(variables.postId) });
        queryClient.invalidateQueries({ queryKey: ["my-posts"] });

        // 2. 성공 토스트
        const message = options?.successMessage ?? "게시글이 수정되었습니다.";
        toast.success(message);

        // 3. 사용자 콜백
        await options?.onSuccess?.(result.data);

        // 4. 라우팅
        if (options?.redirectTo !== false) {
          const path =
            typeof options?.redirectTo === "function"
              ? options.redirectTo(result.data)
              : (options?.redirectTo ?? `/posts/${variables.postId}`);
          router.push(path);
        }
      } else {
        const message =
          options?.errorMessage ?? result.error ?? "게시글 수정 중 오류가 발생했습니다.";
        toast.error(message);
      }
    },

    onError: (error) => {
      console.error("게시글 수정 실패:", error);
      const message = options?.errorMessage ?? "게시글 수정 중 오류가 발생했습니다.";
      toast.error(message);
      options?.onError?.(error);
    },
  });
}
