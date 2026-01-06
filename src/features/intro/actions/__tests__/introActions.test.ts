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
  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(result).toEqual(intro);
  });

  it("백엔드 클라이언트로 소개를 삭제해야 함", async () => {
    // Given
    const deleteIntro = jest.fn().mockResolvedValue(undefined);
    createBackendApiClientMock.mockReturnValue({ deleteIntro } as any);

    // When
    await deleteIntroAction(123);

    // Then
    expect(deleteIntro).toHaveBeenCalledWith({ introId: 123 });
  });
});
