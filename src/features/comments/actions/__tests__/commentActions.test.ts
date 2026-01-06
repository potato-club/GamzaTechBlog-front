import {
  createCommentAction,
  deleteCommentAction,
} from "@/features/comments/actions/commentActions";
import { createCommentServiceServer } from "@/features/comments/services/commentService.server";
import { postCacheInvalidation } from "@/features/posts/utils/cacheInvalidation";
import type { CommentRequest, CommentResponse } from "@/generated/api";

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
  beforeEach(() => {
    jest.clearAllMocks();
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
});
