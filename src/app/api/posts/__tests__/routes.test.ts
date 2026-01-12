import { forwardPostRequest } from "@/app/api/posts/_proxy";
import { POST as imagesPost } from "@/app/api/posts/images/route";

jest.mock("@/app/api/posts/_proxy", () => ({
  forwardPostRequest: jest.fn(),
}));

const forwardPostRequestMock = forwardPostRequest as jest.MockedFunction<typeof forwardPostRequest>;

describe("post route handlers", () => {
  beforeEach(() => {
    forwardPostRequestMock.mockResolvedValue(new Response(null, { status: 200 }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("이미지 업로드 라우트가 백엔드 이미지 경로로 전달되어야 함", async () => {
    // Given: 이미지 업로드 BFF 라우트로 들어온 POST 요청
    const request = new Request("http://localhost/api/posts/images", { method: "POST" });

    // When: 이미지 업로드 라우트 핸들러를 호출하면
    await imagesPost(request);

    // Then: 백엔드 이미지 업로드 경로로 프록시 호출된다
    expect(forwardPostRequestMock).toHaveBeenCalledWith(request, "/api/v1/posts/images");
  });
});
