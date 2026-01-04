import { forwardAuthRequest } from "@/app/api/auth/_proxy";
import { POST as loginPost } from "@/app/api/auth/login/route";
import { POST as logoutPost } from "@/app/api/auth/logout/route";
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

  it("로그인 라우트가 백엔드 로그인 경로로 전달되어야 함", async () => {
    // Given: 로그인 BFF 라우트로 들어온 POST 요청
    const request = new Request("http://localhost/api/auth/login", { method: "POST" });

    // When: 로그인 라우트 핸들러를 호출하면
    await loginPost(request);

    // Then: 백엔드 로그인 경로로 프록시 호출된다
    expect(forwardAuthRequestMock).toHaveBeenCalledWith(request, "/api/auth/login");
  });

  it("로그아웃 라우트가 백엔드 로그아웃 경로로 전달되어야 함", async () => {
    // Given: 로그아웃 BFF 라우트로 들어온 POST 요청
    const request = new Request("http://localhost/api/auth/logout", { method: "POST" });

    // When: 로그아웃 라우트 핸들러를 호출하면
    await logoutPost(request);

    // Then: 백엔드 로그아웃 경로로 프록시 호출된다
    expect(forwardAuthRequestMock).toHaveBeenCalledWith(request, "/api/auth/me/logout");
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
