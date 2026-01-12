import { approveUserAction } from "@/features/admin/actions/adminActions";
import { createBackendApiClient } from "@/lib/serverApiClient";

jest.mock("@/lib/serverApiClient", () => ({
  createBackendApiClient: jest.fn(),
}));

const createBackendApiClientMock = createBackendApiClient as jest.MockedFunction<
  typeof createBackendApiClient
>;

describe("adminActions", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("백엔드 클라이언트로 사용자를 승인해야 함", async () => {
    // Given
    const approveUserProfile = jest.fn().mockResolvedValue(undefined);
    createBackendApiClientMock.mockReturnValue({ approveUserProfile } as any);

    // When
    const result = await approveUserAction(55);

    // Then
    expect(approveUserProfile).toHaveBeenCalledWith({ id: 55 });
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("사용자 승인 실패 시 에러 결과를 반환해야 함", async () => {
    // Given
    const approveUserProfile = jest.fn().mockRejectedValue(new Error("승인 실패"));
    createBackendApiClientMock.mockReturnValue({ approveUserProfile } as any);

    // When
    const result = await approveUserAction(77);

    // Then
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("승인 실패");
    }
  });
});
