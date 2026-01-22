import {
  createCommentAction,
  deleteCommentAction,
} from "@/features/comments/actions/commentActions";
import { createCommentServiceServer } from "@/features/comments/services/commentService.server";
import { postCacheInvalidation } from "@/features/posts/utils/cacheInvalidation";
import type { CommentRequest, CommentResponse } from "@/generated/orval/models";

jest.mock("@/features/comments/services/commentService.server", () => ({
  createCommentServiceServer: jest.fn(),
}));

jest.mock("@/features/posts/utils/cacheInvalidation", () => ({
  postCacheInvalidation: {
    invalidateDetail: jest.fn(),
  },
}));

const createCommentServiceServerMock = createCommentServiceServer as jest.MockedFunction<
  typeof createCommentServiceServer
>;
const postCacheInvalidationMock = postCacheInvalidation as jest.Mocked<
  typeof postCacheInvalidation
>;

describe("commentActions", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("댓글 생성 시 캐시를 무효화해야 함", async () => {
    // Given
    const postId = 10;
    const request: CommentRequest = { content: "안녕" };
    const created: CommentResponse = { commentId: 1, content: "안녕" };
    const registerComment = jest.fn().mockResolvedValue(created);
    createCommentServiceServerMock.mockReturnValue({ registerComment } as any);

    // When
    const result = await createCommentAction(postId, request);

    // Then
    expect(registerComment).toHaveBeenCalledWith(postId, request);
    expect(postCacheInvalidationMock.invalidateDetail).toHaveBeenCalledWith(postId);
    expect(result).toEqual({ success: true, data: created });
  });

  it("댓글 삭제 시 캐시를 무효화해야 함", async () => {
    // Given
    const postId = 20;
    const commentId = 999;
    const deleteComment = jest.fn().mockResolvedValue(undefined);
    createCommentServiceServerMock.mockReturnValue({ deleteComment } as any);

    // When
    const result = await deleteCommentAction(postId, commentId);

    // Then
    expect(deleteComment).toHaveBeenCalledWith(commentId);
    expect(postCacheInvalidationMock.invalidateDetail).toHaveBeenCalledWith(postId);
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("댓글 생성 실패 시 에러 결과를 반환해야 함", async () => {
    // Given
    const postId = 11;
    const request: CommentRequest = { content: "실패" };
    const registerComment = jest.fn().mockRejectedValue(new Error("댓글 생성 실패"));
    createCommentServiceServerMock.mockReturnValue({ registerComment } as any);

    // When
    const result = await createCommentAction(postId, request);

    // Then
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("댓글 생성 실패");
    }
    expect(postCacheInvalidationMock.invalidateDetail).not.toHaveBeenCalled();
  });

  it("댓글 삭제 실패 시 에러 결과를 반환해야 함", async () => {
    // Given
    const postId = 12;
    const commentId = 555;
    const deleteComment = jest.fn().mockRejectedValue(new Error("댓글 삭제 실패"));
    createCommentServiceServerMock.mockReturnValue({ deleteComment } as any);

    // When
    const result = await deleteCommentAction(postId, commentId);

    // Then
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("댓글 삭제 실패");
    }
    expect(postCacheInvalidationMock.invalidateDetail).not.toHaveBeenCalled();
  });
});
