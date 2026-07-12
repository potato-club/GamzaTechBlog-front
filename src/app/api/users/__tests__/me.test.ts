import { GET } from "@/app/api/users/me/route";
import { createUserServiceServer } from "@/features/user/services/userService.server";
import type { UserProfileResponse } from "@/generated/api/models";

jest.mock("@/features/user/services/userService.server", () => ({
  createUserServiceServer: jest.fn(),
}));

const createUserServiceServerMock = createUserServiceServer as jest.MockedFunction<
  typeof createUserServiceServer
>;

function mockService(overrides: { getUserRole?: jest.Mock; getProfile?: jest.Mock }) {
  const service = {
    getUserRole: overrides.getUserRole ?? jest.fn(),
    getProfile: overrides.getProfile ?? jest.fn(),
  } as unknown as ReturnType<typeof createUserServiceServer>;
  createUserServiceServerMock.mockReturnValue(service);
  return service;
}

describe("GET /api/users/me", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("로그인 사용자면 역할과 프로필을 반환해야 함", async () => {
    // Given: 일반 로그인 사용자
    const profile: UserProfileResponse = { nickname: "dev", role: "USER" };
    mockService({
      getUserRole: jest.fn().mockResolvedValue("USER"),
      getProfile: jest.fn().mockResolvedValue(profile),
    });

    // When
    const response = await GET();
    const body = await response.json();

    // Then
    expect(body).toEqual({ role: "USER", profile });
  });

  it("비로그인(역할 없음)이면 role/profile 모두 null이어야 함", async () => {
    // Given: 비로그인 — getUserRole은 null 반환(서비스가 이미 예외를 삼킴)
    const getProfile = jest.fn();
    mockService({
      getUserRole: jest.fn().mockResolvedValue(null),
      getProfile,
    });

    // When
    const response = await GET();
    const body = await response.json();

    // Then: 프로필 조회를 시도하지 않는다 (개인화 누출/불필요 호출 방지)
    expect(body).toEqual({ role: null, profile: null });
    expect(getProfile).not.toHaveBeenCalled();
  });

  it("PRE_REGISTER면 프로필 없이 역할만 반환해야 함", async () => {
    // Given: 프로필 완성 전 사용자
    const getProfile = jest.fn();
    mockService({
      getUserRole: jest.fn().mockResolvedValue("PRE_REGISTER"),
      getProfile,
    });

    // When
    const response = await GET();
    const body = await response.json();

    // Then
    expect(body).toEqual({ role: "PRE_REGISTER", profile: null });
    expect(getProfile).not.toHaveBeenCalled();
  });

  it("프로필 조회 실패 시에도 500이 아니라 null 프로필로 응답해야 함", async () => {
    // Given: 역할은 있으나 프로필 조회가 실패
    mockService({
      getUserRole: jest.fn().mockResolvedValue("USER"),
      getProfile: jest.fn().mockRejectedValue(new Error("network")),
    });

    // When
    const response = await GET();
    const body = await response.json();

    // Then
    expect(response.status).toBe(200);
    expect(body).toEqual({ role: "USER", profile: null });
  });
});
