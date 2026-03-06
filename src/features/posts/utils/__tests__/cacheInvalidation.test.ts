import { postCacheInvalidation } from "@/features/posts/utils/cacheInvalidation";
import { revalidatePath, revalidateTag } from "next/cache";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

const revalidatePathMock = revalidatePath as jest.MockedFunction<typeof revalidatePath>;
const revalidateTagMock = revalidateTag as jest.MockedFunction<typeof revalidateTag>;

describe("postCacheInvalidation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("목록 캐시를 무효화해야 함", () => {
    // When
    postCacheInvalidation.invalidateList();

    // Then
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/posts");
    expect(revalidateTagMock).toHaveBeenCalledWith("posts-list", "max");
  });

  it("상세 캐시를 무효화해야 함", () => {
    // When
    postCacheInvalidation.invalidateDetail(42);

    // Then
    expect(revalidatePathMock).toHaveBeenCalledWith("/posts/42");
    expect(revalidateTagMock).toHaveBeenCalledWith("post-42", "max");
  });

  it("전체 캐시를 무효화해야 함", () => {
    // When
    postCacheInvalidation.invalidateAll();

    // Then
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/posts");
    expect(revalidateTagMock).toHaveBeenCalledWith("posts-list", "max");
    expect(revalidateTagMock).toHaveBeenCalledWith("posts", "max");
  });

  it("게시글과 목록 캐시를 함께 무효화해야 함", () => {
    // When
    postCacheInvalidation.invalidatePostAndList(7);

    // Then
    expect(revalidatePathMock).toHaveBeenCalledWith("/posts/7");
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/posts");
    expect(revalidateTagMock).toHaveBeenCalledWith("post-7", "max");
    expect(revalidateTagMock).toHaveBeenCalledWith("posts-list", "max");
  });
});
