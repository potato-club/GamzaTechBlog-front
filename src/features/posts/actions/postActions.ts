"use server";

import type {
  CreatePostInput,
  DeletePostInput,
  UpdatePostInput,
} from "@/features/posts/actions/types";
import { createPostServiceServer } from "@/features/posts/services/postService.server";
import { postCacheInvalidation } from "@/features/posts/utils/cacheInvalidation";
import type { PostResponse } from "@/generated/api";
import { withActionResult } from "@/lib/actionResult";

/**
 * 게시글 생성 Server Action
 *
 * 책임:
 * - 게시글 생성 요청 처리
 * - 성공 시 서버 캐시 무효화
 * - 에러 처리 및 표준화된 응답 반환
 *
 * @param input - 게시글 생성 데이터
 * @returns 생성된 게시글 정보 또는 에러
 */
export const createPostAction = withActionResult(
  async (input: CreatePostInput): Promise<PostResponse> => {
    const postService = createPostServiceServer();
    const newPost = await postService.createPost(input.postData);

    // 서버 캐시 무효화 - 목록 페이지에 새 게시글 즉시 반영
    postCacheInvalidation.invalidateList();

    return newPost;
  }
);

/**
 * 게시글 삭제 Server Action
 *
 * 책임:
 * - 게시글 삭제 요청 처리
 * - 성공 시 관련 캐시 무효화 (상세 + 목록)
 * - 에러 처리
 *
 * @param input - 삭제할 게시글 ID
 * @returns 성공 여부 또는 에러
 */
export const deletePostAction = withActionResult(async (input: DeletePostInput): Promise<void> => {
  const postService = createPostServiceServer();
  await postService.deletePost(input.postId);

  postCacheInvalidation.invalidatePostAndList(input.postId);
});

/**
 * 게시글 수정 Server Action
 *
 * 책임:
 * - 게시글 수정 요청 처리
 * - 성공 시 관련 캐시 무효화 (상세 + 목록)
 * - 에러 처리 및 수정된 데이터 반환
 *
 * @param input - 수정할 게시글 ID와 데이터
 * @returns 수정된 게시글 정보 또는 에러
 */
export const updatePostAction = withActionResult(
  async (input: UpdatePostInput): Promise<PostResponse> => {
    const postService = createPostServiceServer();
    const updatedPost = await postService.updatePost(input.postId, input.postData);

    // 수정된 게시글 상세와 목록 캐시 무효화
    postCacheInvalidation.invalidatePostAndList(input.postId);

    return updatedPost;
  }
);
