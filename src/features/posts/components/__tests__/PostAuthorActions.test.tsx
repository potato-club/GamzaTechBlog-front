import { render, screen } from "@testing-library/react";
import type { UserProfileResponse } from "@/generated/api/models";
import PostAuthorActions from "@/features/posts/components/PostAuthorActions";

const useAuthMock = jest.fn();
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

jest.mock("@/features/posts/components/PostActionsDropdown", () => ({
  PostActionsDropdown: ({ postId }: { postId: number }) => (
    <div data-testid="post-actions">actions:{postId}</div>
  ),
}));

describe("PostAuthorActions (수정/삭제 버튼 클라이언트 게이팅)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("판별 전(isLoading)에는 액션 대신 자리 예약 placeholder만 렌더해야 함(CLS 방지)", () => {
    // Given
    useAuthMock.mockReturnValue({ userProfile: null, isLoading: true });

    // When
    render(<PostAuthorActions postId={7} postWriter="writer" />);

    // Then
    expect(screen.queryByTestId("post-actions")).not.toBeInTheDocument();
    expect(screen.getByTestId("post-actions-placeholder")).toBeInTheDocument();
  });

  it("작성자 본인이면 액션을 노출해야 함", () => {
    // Given
    const profile: UserProfileResponse = { nickname: "writer", role: "USER" };
    useAuthMock.mockReturnValue({ userProfile: profile, isLoading: false });

    // When
    render(<PostAuthorActions postId={7} postWriter="writer" />);

    // Then
    expect(screen.getByTestId("post-actions")).toHaveTextContent("actions:7");
  });

  it("관리자면 타인 글이어도 액션을 노출해야 함", () => {
    // Given
    const admin: UserProfileResponse = { nickname: "admin", role: "ADMIN" };
    useAuthMock.mockReturnValue({ userProfile: admin, isLoading: false });

    // When
    render(<PostAuthorActions postId={7} postWriter="someone-else" />);

    // Then
    expect(screen.getByTestId("post-actions")).toBeInTheDocument();
  });

  it("타인(비작성자)이면 아무것도 렌더하지 않아야 함", () => {
    // Given
    const profile: UserProfileResponse = { nickname: "other", role: "USER" };
    useAuthMock.mockReturnValue({ userProfile: profile, isLoading: false });

    // When
    render(<PostAuthorActions postId={7} postWriter="writer" />);

    // Then
    expect(screen.queryByTestId("post-actions")).not.toBeInTheDocument();
    expect(screen.queryByTestId("post-actions-placeholder")).not.toBeInTheDocument();
  });

  it("비로그인이면 아무것도 렌더하지 않아야 함", () => {
    // Given
    useAuthMock.mockReturnValue({ userProfile: null, isLoading: false });

    // When
    render(<PostAuthorActions postId={7} postWriter="writer" />);

    // Then
    expect(screen.queryByTestId("post-actions")).not.toBeInTheDocument();
  });
});
