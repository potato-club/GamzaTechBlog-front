import { addLikeAction, removeLikeAction } from "@/features/posts/actions/likeActions";
import { createLikeServiceServer } from "@/features/posts/services/likeService.server";
import { postCacheInvalidation } from "@/features/posts/utils/cacheInvalidation";

jest.mock("@/features/posts/services/likeService.server", () => ({
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("좋아요 추가 시 캐시를 무효화해야 함", async () => {
    // Given
    const addLike = jest.fn().mockResolvedValue(undefined);
    createLikeServiceServerMock.mockReturnValue({ addLike } as ReturnType<
      typeof createLikeServiceServer
    >);

    // When
    await addLikeAction(101);

    // Then
    expect(addLike).toHaveBeenCalledWith(101);
    expect(postCacheInvalidationMock.invalidateDetail).toHaveBeenCalledWith(101);
  });

  it("좋아요 취소 시 캐시를 무효화해야 함", async () => {
    // Given
    const removeLike = jest.fn().mockResolvedValue(undefined);
    createLikeServiceServerMock.mockReturnValue({ removeLike } as ReturnType<
      typeof createLikeServiceServer
    >);

    // When
    await removeLikeAction(202);

    // Then
    expect(removeLike).toHaveBeenCalledWith(202);
    expect(postCacheInvalidationMock.invalidateDetail).toHaveBeenCalledWith(202);
  });
});
