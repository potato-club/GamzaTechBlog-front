import {
  updateProfileAction,
  updateProfileImageAction,
  updateProfileInSignupAction,
  withdrawAccountAction,
} from "@/features/user/actions/userActions";
import { createUserServiceServer } from "@/features/user/services/userService.server";
import type {
  ProfileImageResponse,
  UpdateProfileRequest,
  UserProfileRequest,
  UserProfileResponse,
} from "@/generated/api";

jest.mock("@/features/user/services/userService.server", () => ({
  createUserServiceServer: jest.fn(),
}));

const createUserServiceServerMock = createUserServiceServer as jest.MockedFunction<
  typeof createUserServiceServer
>;

describe("userActions", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("회원가입 프로필 업데이트를 성공적으로 처리해야 함", async () => {
    // Given
    const request: UserProfileRequest = {
      email: "test@example.com",
      studentNumber: "20250001",
      gamjaBatch: 4,
      position: "FRONTEND",
    };
    const updated: UserProfileResponse = {
      nickname: "tester",
      email: request.email,
      studentNumber: request.studentNumber,
      gamjaBatch: request.gamjaBatch,
      position: request.position,
    };
    const updateProfileInSignup = jest.fn().mockResolvedValue(updated);
    createUserServiceServerMock.mockReturnValue({ updateProfileInSignup } as any);

    // When
    const result = await updateProfileInSignupAction(request);

    // Then
    expect(updateProfileInSignup).toHaveBeenCalledWith(request);
    expect(result).toEqual({ success: true, data: updated });
  });

  it("프로필 업데이트 실패 시 에러 결과를 반환해야 함", async () => {
    // Given
    const request: UpdateProfileRequest = {
      email: "fail@example.com",
      studentNumber: "20250002",
      gamjaBatch: 4,
      position: "BACKEND",
    };
    const updateProfile = jest.fn().mockRejectedValue(new Error("프로필 업데이트 실패"));
    createUserServiceServerMock.mockReturnValue({ updateProfile } as any);

    // When
    const result = await updateProfileAction(request);

    // Then
    expect(updateProfile).toHaveBeenCalledWith(request);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("프로필 업데이트 실패");
    }
  });

  it("프로필 이미지 업데이트를 성공적으로 처리해야 함", async () => {
    // Given
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    const response: ProfileImageResponse = { imageUrl: "https://example.com/avatar.png" };
    const updateProfileImage = jest.fn().mockResolvedValue(response);
    createUserServiceServerMock.mockReturnValue({ updateProfileImage } as any);

    // When
    const result = await updateProfileImageAction(file);

    // Then
    expect(updateProfileImage).toHaveBeenCalledWith(file);
    expect(result).toEqual({ success: true, data: response });
  });

  it("회원 탈퇴를 성공적으로 처리해야 함", async () => {
    // Given
    const withdrawAccount = jest.fn().mockResolvedValue(undefined);
    createUserServiceServerMock.mockReturnValue({ withdrawAccount } as any);

    // When
    const result = await withdrawAccountAction();

    // Then
    expect(withdrawAccount).toHaveBeenCalled();
    expect(result).toEqual({ success: true, data: undefined });
  });
});
