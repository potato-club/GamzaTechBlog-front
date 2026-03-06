import {
  createPostAction,
  deletePostAction,
  updatePostAction,
} from "@/features/posts/actions/postActions";
import { createPostServiceServer } from "@/features/posts/services/postService.server";
import { postCacheInvalidation } from "@/features/posts/utils/cacheInvalidation";
import type { PostRequest, PostResponse } from "@/generated/api";

jest.mock("@/features/posts/services/postService.server", () => ({
  createPostServiceServer: jest.fn(),
}));

jest.mock("@/features/posts/utils/cacheInvalidation", () => ({
  postCacheInvalidation: {
    invalidateList: jest.fn(),
    invalidatePostAndList: jest.fn(),
  },
}));

const createPostServiceServerMock = createPostServiceServer as jest.MockedFunction<
  typeof createPostServiceServer
>;
const postCacheInvalidationMock = postCacheInvalidation as jest.Mocked<
  typeof postCacheInvalidation
>;

describe("postActions", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("게시글 생성 시 목록 캐시를 무효화해야 함", async () => {
    // Given
    const postData = { title: "t", content: "c" } as PostRequest;
    const createdPost = { postId: 1 } as PostResponse;
    const createPost = jest.fn().mockResolvedValue(createdPost);
    createPostServiceServerMock.mockReturnValue({ createPost } as any);

    // When
    const result = await createPostAction({ postData });

    // Then
    expect(createPost).toHaveBeenCalledWith(postData);
    expect(postCacheInvalidationMock.invalidateList).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ success: true, data: createdPost });
  });

  it("게시글 생성 실패 시 에러 결과를 반환해야 함", async () => {
    // Given
    const postData = { title: "t", content: "c" } as PostRequest;
    const createPost = jest.fn().mockRejectedValue(new Error("생성 실패"));
    createPostServiceServerMock.mockReturnValue({ createPost } as any);

    // When
    const result = await createPostAction({ postData });

    // Then
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("생성 실패");
    }
    expect(postCacheInvalidationMock.invalidateList).not.toHaveBeenCalled();
  });

  it("게시글 삭제 시 상세/목록 캐시를 무효화해야 함", async () => {
    // Given
    const deletePost = jest.fn().mockResolvedValue(undefined);
    createPostServiceServerMock.mockReturnValue({ deletePost } as any);

    // When
    const result = await deletePostAction({ postId: 99 });

    // Then
    expect(deletePost).toHaveBeenCalledWith(99);
    expect(postCacheInvalidationMock.invalidatePostAndList).toHaveBeenCalledWith(99);
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("게시글 수정 시 상세/목록 캐시를 무효화해야 함", async () => {
    // Given
    const postData = { title: "t", content: "c" } as PostRequest;
    const updatedPost = { postId: 9 } as PostResponse;
    const updatePost = jest.fn().mockResolvedValue(updatedPost);
    createPostServiceServerMock.mockReturnValue({ updatePost } as any);

    // When
    const result = await updatePostAction({ postId: 9, postData });

    // Then
    expect(updatePost).toHaveBeenCalledWith(9, postData);
    expect(postCacheInvalidationMock.invalidatePostAndList).toHaveBeenCalledWith(9);
    expect(result).toEqual({ success: true, data: updatedPost });
  });

  it("게시글 삭제 실패 시 에러 결과를 반환해야 함", async () => {
    // Given
    const deletePost = jest.fn().mockRejectedValue(new Error("삭제 실패"));
    createPostServiceServerMock.mockReturnValue({ deletePost } as any);

    // When
    const result = await deletePostAction({ postId: 99 });

    // Then
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("삭제 실패");
    }
    expect(postCacheInvalidationMock.invalidatePostAndList).not.toHaveBeenCalled();
  });

  it("게시글 수정 실패 시 에러 결과를 반환해야 함", async () => {
    // Given
    const postData = { title: "t", content: "c" } as PostRequest;
    const updatePost = jest.fn().mockRejectedValue(new Error("수정 실패"));
    createPostServiceServerMock.mockReturnValue({ updatePost } as any);

    // When
    const result = await updatePostAction({ postId: 9, postData });

    // Then
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("수정 실패");
    }
    expect(postCacheInvalidationMock.invalidatePostAndList).not.toHaveBeenCalled();
  });
});
