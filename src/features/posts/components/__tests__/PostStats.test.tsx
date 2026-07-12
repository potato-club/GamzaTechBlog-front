import { render, screen, waitFor } from "@testing-library/react";
import PostStats from "@/features/posts/components/PostStats";

const useAuthMock = jest.fn();
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

jest.mock("@/features/likes", () => ({
  useAddLike: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useRemoveLike: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element -- 테스트 mock: next/image를 단순 img로 대체
  default: (props: React.ComponentProps<"img">) => <img {...props} />,
}));

function getHeartPath(): SVGPathElement {
  const path = document.querySelector("svg path");
  if (!path) throw new Error("heart path not found");
  return path as unknown as SVGPathElement;
}

describe("PostStats 좋아요 초기 상태 (클라이언트 조회)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("로그인 상태면 마운트 후 좋아요 상태를 조회해 하트를 채워야 함", async () => {
    // Given
    useAuthMock.mockReturnValue({ isLoggedIn: true });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ liked: true }),
    });

    // When
    render(<PostStats postId={42} initialLikesCount={3} commentsCount={1} />);

    // Then: 좋아요 상태 조회
    expect(global.fetch).toHaveBeenCalledWith("/api/posts/42/like-status", expect.anything());
    await waitFor(() => {
      expect(getHeartPath()).toHaveAttribute("fill", "#FF5E5E");
    });
  });

  it("비로그인 상태면 좋아요 상태를 조회하지 않아야 함", () => {
    // Given
    useAuthMock.mockReturnValue({ isLoggedIn: false });

    // When
    render(<PostStats postId={42} initialLikesCount={3} commentsCount={1} />);

    // Then
    expect(global.fetch).not.toHaveBeenCalled();
    expect(getHeartPath()).toHaveAttribute("fill", "none");
  });

  it("공용 데이터(좋아요 수·댓글 수)는 그대로 노출해야 함", () => {
    // Given
    useAuthMock.mockReturnValue({ isLoggedIn: false });

    // When
    render(<PostStats postId={42} initialLikesCount={7} commentsCount={5} />);

    // Then
    expect(screen.getByText("좋아요 7")).toBeInTheDocument();
    expect(screen.getByText("댓글 5")).toBeInTheDocument();
  });
});
