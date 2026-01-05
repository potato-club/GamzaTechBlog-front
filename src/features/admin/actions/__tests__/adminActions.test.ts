import { approveUserAction } from "@/features/admin/actions/adminActions";
import { createBackendApiClient } from "@/lib/serverApiClient";

jest.mock("@/lib/serverApiClient", () => ({
  createBackendApiClient: jest.fn(),
}));

const createBackendApiClientMock = createBackendApiClient as jest.MockedFunction<
  typeof createBackendApiClient
>;

describe("adminActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("백엔드 클라이언트로 사용자를 승인해야 함", async () => {
    // Given
    const approveUserProfile = jest.fn().mockResolvedValue(undefined);
    createBackendApiClientMock.mockReturnValue({ approveUserProfile } as ReturnType<
      typeof createBackendApiClient
    >);

    // When
    await approveUserAction(55);

    // Then
    expect(approveUserProfile).toHaveBeenCalledWith({ id: 55 });
  });
});
