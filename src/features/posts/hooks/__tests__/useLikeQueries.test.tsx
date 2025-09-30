/**
 * 좋아요 기능 테스트
 *
 * 테스트 목적:
 * - 좋아요 추가 시 mockRevalidatePostAction이 호출되는지 확인
 * - 좋아요 삭제 시 mockRevalidatePostAction이 호출되는지 확인
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { likeService } from "../../services/likeService";
import { useAddLike, useRemoveLike } from "../useLikeQueries";

// Mock 설정 (ESM 모듈 문제 회피를 위해 사용하는 모듈도 mock)
jest.mock("@/lib/markdown", () => ({
  markdownToText: jest.fn((text: string) => text),
}));

jest.mock("../../components/MarkdownViewer", () => ({
  MarkdownViewer: () => null,
}));

jest.mock("../../services/likeService");

// mockRevalidatePostAction을 mock으로 대체 (실제 모듈 import 방지)
const mockRevalidatePostAction = jest.fn();
jest.mock("@/app/actions/revalidate", () => ({
  revalidatePostAction: (...args: any[]) => mockRevalidatePostAction(...args),
}));

/**
 * 테스트용 QueryClient Provider 래퍼
 */
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useAddLike", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("좋아요 추가 성공 시 mockRevalidatePostAction이 호출되어야 함", async () => {
    // Given
    (likeService.addLike as jest.Mock).mockResolvedValue({});
    (mockRevalidatePostAction as jest.Mock).mockResolvedValue({ success: true });

    const wrapper = createWrapper();
    const postId = 123;

    // When
    const { result } = renderHook(() => useAddLike(postId), { wrapper });
    await result.current.mutateAsync();

    // Then
    await waitFor(() => {
      expect(mockRevalidatePostAction).toHaveBeenCalledWith(postId);
      expect(mockRevalidatePostAction).toHaveBeenCalledTimes(1);
    });

    expect(likeService.addLike).toHaveBeenCalledWith(postId);
  });

  it("좋아요 추가 실패 시 mockRevalidatePostAction이 호출되지 않아야 함", async () => {
    // Given
    (likeService.addLike as jest.Mock).mockRejectedValue(new Error("Network error"));

    const wrapper = createWrapper();
    const postId = 123;

    // When
    const { result } = renderHook(() => useAddLike(postId), { wrapper });
    await expect(result.current.mutateAsync()).rejects.toThrow("Network error");

    // Then
    expect(mockRevalidatePostAction).not.toHaveBeenCalled();
  });

  it("mockRevalidatePostAction 실패해도 mutation 자체는 성공해야 함", async () => {
    // Given
    (likeService.addLike as jest.Mock).mockResolvedValue({});
    mockRevalidatePostAction.mockRejectedValue(new Error("Revalidation failed"));

    const wrapper = createWrapper();
    const postId = 123;

    // When
    const { result } = renderHook(() => useAddLike(postId), { wrapper });
    await result.current.mutateAsync();

    // Then
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
  });
});

describe("useRemoveLike", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("좋아요 취소 성공 시 mockRevalidatePostAction이 호출되어야 함", async () => {
    // Given
    (likeService.removeLike as jest.Mock).mockResolvedValue({});
    mockRevalidatePostAction.mockResolvedValue({ success: true });

    const wrapper = createWrapper();
    const postId = 456;

    // When
    const { result } = renderHook(() => useRemoveLike(postId), { wrapper });
    await result.current.mutateAsync();

    // Then
    await waitFor(() => {
      expect(mockRevalidatePostAction).toHaveBeenCalledWith(postId);
      expect(mockRevalidatePostAction).toHaveBeenCalledTimes(1);
    });

    expect(likeService.removeLike).toHaveBeenCalledWith(postId);
  });

  it("좋아요 취소 실패 시 mockRevalidatePostAction이 호출되지 않아야 함", async () => {
    // Given
    (likeService.removeLike as jest.Mock).mockRejectedValue(new Error("Not authorized"));

    const wrapper = createWrapper();
    const postId = 456;

    // When
    const { result } = renderHook(() => useRemoveLike(postId), { wrapper });
    await expect(result.current.mutateAsync()).rejects.toThrow("Not authorized");

    // Then
    expect(mockRevalidatePostAction).not.toHaveBeenCalled();
  });
});
