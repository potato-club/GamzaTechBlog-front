import { GET } from "@/app/api/posts/[postId]/like-status/route";
import { createLikeServiceServer } from "@/features/likes/services/likeService.server";

jest.mock("@/features/likes/services/likeService.server", () => ({
  createLikeServiceServer: jest.fn(),
}));

const createLikeServiceServerMock = createLikeServiceServer as jest.MockedFunction<
  typeof createLikeServiceServer
>;

function mockLikeService(checkLikeStatus: jest.Mock) {
  createLikeServiceServerMock.mockReturnValue({
    checkLikeStatus,
  } as unknown as ReturnType<typeof createLikeServiceServer>);
}

function makeParams(postId: string) {
  return { params: Promise.resolve({ postId }) };
}

describe("GET /api/posts/[postId]/like-status", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("좋아요 상태를 조회해 반환해야 함", async () => {
    // Given
    const checkLikeStatus = jest.fn().mockResolvedValue(true);
    mockLikeService(checkLikeStatus);

    // When
    const response = await GET(new Request("http://localhost"), makeParams("42"));
    const body = await response.json();

    // Then
    expect(checkLikeStatus).toHaveBeenCalledWith(42, expect.anything());
    expect(body).toEqual({ liked: true });
  });

  it("조회 실패(비로그인 등) 시 liked=false로 응답해야 함", async () => {
    // Given
    mockLikeService(jest.fn().mockRejectedValue(new Error("unauthorized")));

    // When
    const response = await GET(new Request("http://localhost"), makeParams("42"));
    const body = await response.json();

    // Then
    expect(response.status).toBe(200);
    expect(body).toEqual({ liked: false });
  });

  it("잘못된 postId면 400과 liked=false", async () => {
    // Given
    const checkLikeStatus = jest.fn();
    mockLikeService(checkLikeStatus);

    // When
    const response = await GET(new Request("http://localhost"), makeParams("abc"));
    const body = await response.json();

    // Then
    expect(response.status).toBe(400);
    expect(body).toEqual({ liked: false });
    expect(checkLikeStatus).not.toHaveBeenCalled();
  });
});
