import { postCacheInvalidation } from "@/features/posts/utils/cacheInvalidation";
import { revalidateTag } from "next/cache";

jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));

const revalidateTagMock = revalidateTag as jest.MockedFunction<typeof revalidateTag>;

describe("postCacheInvalidation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("목록 캐시를 무효화해야 함", () => {
    // When
    postCacheInvalidation.invalidateList();

    // Then
    expect(revalidateTagMock).toHaveBeenCalledWith("posts-list", "max");
  });

  it("상세 캐시를 무효화해야 함", () => {
    // When
    postCacheInvalidation.invalidateDetail(42);

    // Then
    expect(revalidateTagMock).toHaveBeenCalledWith("post-42", "max");
  });

  it("전체 캐시를 무효화해야 함", () => {
    // When
    postCacheInvalidation.invalidateAll();

    // Then
    expect(revalidateTagMock).toHaveBeenCalledWith("posts-list", "max");
    expect(revalidateTagMock).toHaveBeenCalledWith("posts", "max");
  });

  it("게시글과 목록 캐시를 함께 무효화해야 함", () => {
    // When
    postCacheInvalidation.invalidatePostAndList(7);

    // Then
    expect(revalidateTagMock).toHaveBeenCalledWith("post-7", "max");
    expect(revalidateTagMock).toHaveBeenCalledWith("posts-list", "max");
  });
});
