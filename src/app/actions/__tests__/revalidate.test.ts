/**
 * Server Action 테스트
 *
 * 테스트 목적:
 * - revalidatePostAction이 올바른 경로로 revalidatePath를 호출하는지 확인
 * - 성공/실패 시나리오 검증
 */

import { revalidatePath } from "next/cache";
import { revalidatePostAction } from "../revalidate";

// next/cache의 revalidatePath를 mock 함수로 대체
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("revalidatePostAction", () => {
  // 각 테스트 전에 mock 함수 초기화
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * 테스트 1: 정상 동작 확인
   */
  it("postId를 받아서 /posts/{postId} 경로를 revalidate해야 함", async () => {
    // Given: postId가 123일 때
    const postId = 123;

    // When: revalidatePostAction 호출
    const result = await revalidatePostAction(postId);

    // Then: revalidatePath가 올바른 경로로 호출되어야 함
    expect(revalidatePath).toHaveBeenCalledWith("/posts/123");
    expect(revalidatePath).toHaveBeenCalledTimes(1);

    // Then: success: true를 반환해야 함
    expect(result).toEqual({ success: true });
  });

  /**
   * 테스트 2: 에러 처리 확인
   */
  it("revalidatePath 실패 시 success: false와 error를 반환해야 함", async () => {
    // Given: revalidatePath가 에러를 던지도록 설정
    const mockError = new Error("Revalidation failed");
    (revalidatePath as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    // When: revalidatePostAction 호출
    const result = await revalidatePostAction(123);

    // Then: success: false와 error가 반환되어야 함
    expect(result).toEqual({
      success: false,
      error: mockError,
    });
  });

  /**
   * 테스트 3: 여러 postId로 호출해도 각각 올바른 경로로 호출되는지 확인
   */
  it("다양한 postId에 대해 올바른 경로를 생성해야 함", async () => {
    // Given & When: 여러 postId로 호출
    await revalidatePostAction(1);
    await revalidatePostAction(999);
    await revalidatePostAction(456);

    // Then: 각각 올바른 경로로 호출되어야 함
    expect(revalidatePath).toHaveBeenNthCalledWith(1, "/posts/1");
    expect(revalidatePath).toHaveBeenNthCalledWith(2, "/posts/999");
    expect(revalidatePath).toHaveBeenNthCalledWith(3, "/posts/456");
    expect(revalidatePath).toHaveBeenCalledTimes(3);
  });
});
