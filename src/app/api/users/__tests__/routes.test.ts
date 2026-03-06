import { forwardUserRequest } from "@/app/api/users/_proxy";
import { GET as profileGet } from "@/app/api/users/me/profile/route";
import { GET as roleGet } from "@/app/api/users/me/role/route";

jest.mock("@/app/api/users/_proxy", () => ({
  forwardUserRequest: jest.fn(),
}));

const forwardUserRequestMock = forwardUserRequest as jest.MockedFunction<typeof forwardUserRequest>;

describe("user route handlers", () => {
  beforeEach(() => {
    forwardUserRequestMock.mockResolvedValue(new Response(null, { status: 200 }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("프로필 라우트가 백엔드 프로필 경로로 전달되어야 함", async () => {
    // Given: 프로필 BFF 라우트로 들어온 GET 요청
    const request = new Request("http://localhost/api/users/me/profile", { method: "GET" });

    // When: 프로필 라우트 핸들러를 호출하면
    await profileGet(request);

    // Then: 백엔드 프로필 경로로 프록시 호출된다
    expect(forwardUserRequestMock).toHaveBeenCalledWith(request, "/api/v1/users/me/get/profile");
  });

  it("역할 라우트가 백엔드 역할 경로로 전달되어야 함", async () => {
    // Given: 역할 BFF 라우트로 들어온 GET 요청
    const request = new Request("http://localhost/api/users/me/role", { method: "GET" });

    // When: 역할 라우트 핸들러를 호출하면
    await roleGet(request);

    // Then: 백엔드 역할 경로로 프록시 호출된다
    expect(forwardUserRequestMock).toHaveBeenCalledWith(request, "/api/v1/users/me/role");
  });
});
