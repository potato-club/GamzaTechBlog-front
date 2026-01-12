import { createIntroAction, deleteIntroAction } from "@/features/intro/actions/introActions";
import type { IntroResponse } from "@/generated/api";
import { createBackendApiClient } from "@/lib/serverApiClient";

jest.mock("@/lib/serverApiClient", () => ({
  createBackendApiClient: jest.fn(),
}));

const createBackendApiClientMock = createBackendApiClient as jest.MockedFunction<
  typeof createBackendApiClient
>;

describe("introAction", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("백엔드 클라이언트로 소개를 생성해야 함", async () => {
    // Given
    const intro: IntroResponse = { introId: 1, content: "소개" };
    const createIntro = jest.fn().mockResolvedValue({ data: intro });
    createBackendApiClientMock.mockReturnValue({ createIntro } as any);

    // When
    const result = await createIntroAction("소개");

    // Then
    expect(createIntro).toHaveBeenCalledWith({ introCreateRequest: { content: "소개" } });
    expect(result).toEqual({ success: true, data: intro });
  });

  it("백엔드 클라이언트로 소개를 삭제해야 함", async () => {
    // Given
    const deleteIntro = jest.fn().mockResolvedValue(undefined);
    createBackendApiClientMock.mockReturnValue({ deleteIntro } as any);

    // When
    const result = await deleteIntroAction(123);

    // Then
    expect(deleteIntro).toHaveBeenCalledWith({ introId: 123 });
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("소개 생성 실패 시 에러 결과를 반환해야 함", async () => {
    // Given
    const createIntro = jest.fn().mockRejectedValue(new Error("소개 생성 실패"));
    createBackendApiClientMock.mockReturnValue({ createIntro } as any);

    // When
    const result = await createIntroAction("실패");

    // Then
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("소개 생성 실패");
    }
  });

  it("소개 삭제 실패 시 에러 결과를 반환해야 함", async () => {
    // Given
    const deleteIntro = jest.fn().mockRejectedValue(new Error("소개 삭제 실패"));
    createBackendApiClientMock.mockReturnValue({ deleteIntro } as any);

    // When
    const result = await deleteIntroAction(999);

    // Then
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("소개 삭제 실패");
    }
  });
});
