import { createIntroAction, deleteIntroAction } from "@/features/intro/actions/introActions";
import type { IntroResponse } from "@/generated/orval/models";
import { serverApiFetchJson } from "@/lib/serverApiFetch";
import { revalidateTag } from "next/cache";

jest.mock("@/lib/serverApiFetch", () => ({
  serverApiFetchJson: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));

const serverApiFetchJsonMock = serverApiFetchJson as jest.MockedFunction<typeof serverApiFetchJson>;
const revalidateTagMock = revalidateTag as jest.MockedFunction<typeof revalidateTag>;

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
    serverApiFetchJsonMock.mockResolvedValue({ data: intro });

    // When
    const result = await createIntroAction("소개");

    // Then
    expect(serverApiFetchJsonMock).toHaveBeenCalledWith("/api/v1/intros", {
      method: "POST",
      body: JSON.stringify({ content: "소개" }),
    });
    expect(revalidateTagMock).toHaveBeenCalledWith("intros-list", "max");
    expect(result).toEqual({ success: true, data: intro });
  });

  it("백엔드 클라이언트로 소개를 삭제해야 함", async () => {
    // Given
    serverApiFetchJsonMock.mockResolvedValue(undefined);

    // When
    const result = await deleteIntroAction(123);

    // Then
    expect(serverApiFetchJsonMock).toHaveBeenCalledWith("/api/v1/intros/123", {
      method: "DELETE",
    });
    expect(revalidateTagMock).toHaveBeenCalledWith("intros-list", "max");
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("소개 생성 실패 시 에러 결과를 반환해야 함", async () => {
    // Given
    serverApiFetchJsonMock.mockRejectedValue(new Error("소개 생성 실패"));

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
    serverApiFetchJsonMock.mockRejectedValue(new Error("소개 삭제 실패"));

    // When
    const result = await deleteIntroAction(999);

    // Then
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("소개 삭제 실패");
    }
  });
});
