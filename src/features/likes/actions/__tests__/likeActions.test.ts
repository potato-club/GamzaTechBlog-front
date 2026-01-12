import { addLikeAction, removeLikeAction } from "@/features/likes/actions/likeActions";
import { createLikeServiceServer } from "@/features/likes/services/likeService.server";
import { postCacheInvalidation } from "@/features/posts/utils/cacheInvalidation";

jest.mock("@/features/likes/services/likeService.server", () => ({
  createLikeServiceServer: jest.fn(),
}));

jest.mock("@/features/posts/utils/cacheInvalidation", () => ({
  postCacheInvalidation: {
    invalidateDetail: jest.fn(),
  },
}));

const createLikeServiceServerMock = createLikeServiceServer as jest.MockedFunction<
  typeof createLikeServiceServer
>;
const postCacheInvalidationMock = postCacheInvalidation as jest.Mocked<
  typeof postCacheInvalidation
>;

describe("likeActions", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("좋아요 추가 시 캐시를 무효화해야 함", async () => {
    // Given
    const addLike = jest.fn().mockResolvedValue(undefined);
    createLikeServiceServerMock.mockReturnValue({ addLike } as any);

    // When
    const result = await addLikeAction(101);

    // Then
    expect(addLike).toHaveBeenCalledWith(101);
    expect(postCacheInvalidationMock.invalidateDetail).toHaveBeenCalledWith(101);
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("좋아요 취소 시 캐시를 무효화해야 함", async () => {
    // Given
    const removeLike = jest.fn().mockResolvedValue(undefined);
    createLikeServiceServerMock.mockReturnValue({ removeLike } as any);

    // When
    const result = await removeLikeAction(202);

    // Then
    expect(removeLike).toHaveBeenCalledWith(202);
    expect(postCacheInvalidationMock.invalidateDetail).toHaveBeenCalledWith(202);
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("좋아요 추가 실패 시 에러 결과를 반환해야 함", async () => {
    // Given
    const addLike = jest.fn().mockRejectedValue(new Error("좋아요 추가 실패"));
    createLikeServiceServerMock.mockReturnValue({ addLike } as any);

    // When
    const result = await addLikeAction(303);

    // Then
    expect(result.success).toBe(false);
    expect(result.error).toBe("좋아요 추가 실패");
    expect(postCacheInvalidationMock.invalidateDetail).not.toHaveBeenCalled();
  });

  it("좋아요 취소 실패 시 에러 결과를 반환해야 함", async () => {
    // Given
    const removeLike = jest.fn().mockRejectedValue(new Error("좋아요 취소 실패"));
    createLikeServiceServerMock.mockReturnValue({ removeLike } as any);

    // When
    const result = await removeLikeAction(404);

    // Then
    expect(result.success).toBe(false);
    expect(result.error).toBe("좋아요 취소 실패");
    expect(postCacheInvalidationMock.invalidateDetail).not.toHaveBeenCalled();
  });
});
