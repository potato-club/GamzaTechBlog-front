import { forwardAuthRequest } from "@/app/api/auth/_proxy";
import { POST as reissuePost } from "@/app/api/auth/reissue/route";

jest.mock("@/app/api/auth/_proxy", () => ({
  forwardAuthRequest: jest.fn(),
}));

const forwardAuthRequestMock = forwardAuthRequest as jest.MockedFunction<typeof forwardAuthRequest>;

describe("auth route handlers", () => {
  beforeEach(() => {
    forwardAuthRequestMock.mockResolvedValue(new Response(null, { status: 200 }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("재발급 라우트가 백엔드 재발급 경로로 전달되어야 함", async () => {
    // Given: 재발급 BFF 라우트로 들어온 POST 요청
    const request = new Request("http://localhost/api/auth/reissue", { method: "POST" });

    // When: 재발급 라우트 핸들러를 호출하면
    await reissuePost(request);

    // Then: 백엔드 재발급 경로로 프록시 호출된다
    expect(forwardAuthRequestMock).toHaveBeenCalledWith(request, "/api/auth/reissue");
  });
});
