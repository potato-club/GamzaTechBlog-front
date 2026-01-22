import { approveUserAction } from "@/features/admin/actions/adminActions";
import { serverApiFetchJson } from "@/lib/serverApiFetch";

jest.mock("@/lib/serverApiFetch", () => ({
  serverApiFetchJson: jest.fn(),
}));

const serverApiFetchJsonMock = serverApiFetchJson as jest.MockedFunction<
  typeof serverApiFetchJson
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
    serverApiFetchJsonMock.mockResolvedValue(undefined);

    // When
    const result = await approveUserAction(55);

    // Then
    expect(serverApiFetchJsonMock).toHaveBeenCalledWith("/api/admin/users/55/approve", {
      method: "PUT",
    });
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("사용자 승인 실패 시 에러 결과를 반환해야 함", async () => {
    // Given
    serverApiFetchJsonMock.mockRejectedValue(new Error("승인 실패"));

    // When
    const result = await approveUserAction(77);

    // Then
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("승인 실패");
    }
  });
});
