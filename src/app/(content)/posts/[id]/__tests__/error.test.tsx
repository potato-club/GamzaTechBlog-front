import { render, screen, fireEvent } from "@testing-library/react";
import PostDetailError from "@/app/(content)/posts/[id]/error";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("게시글 상세 에러 UI", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("일시적 오류임을 알리고 '찾을 수 없음'으로 오해시키지 않아야 함", () => {
    // Given: 백엔드 5xx 등으로 렌더가 실패한 상황
    render(
      <PostDetailError error={new Error("Response returned an error code")} reset={jest.fn()} />
    );

    // Then: 일시적 문제라고 안내한다 (글이 삭제/부재한 것처럼 표시하면 안 됨)
    expect(screen.getByText(/일시적인 문제/)).toBeInTheDocument();
    expect(screen.queryByText(/삭제되었습니다/)).not.toBeInTheDocument();
    expect(screen.queryByText("404")).not.toBeInTheDocument();
  });

  it("'다시 시도' 버튼이 reset을 호출해야 함", () => {
    // Given
    const reset = jest.fn();
    render(<PostDetailError error={new Error("boom")} reset={reset} />);

    // When
    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    // Then: 재시도로 렌더를 다시 시도한다 (백엔드 복구 시 정상 노출)
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("홈으로 돌아가는 링크를 제공해야 함", () => {
    // When
    render(<PostDetailError error={new Error("boom")} reset={jest.fn()} />);

    // Then
    expect(screen.getByRole("link", { name: "홈으로 돌아가기" })).toHaveAttribute("href", "/");
  });

  it("디버깅용 digest가 있으면 노출해야 함", () => {
    // Given: Next가 서버 에러에 부여하는 digest
    const error = Object.assign(new Error("boom"), { digest: "abc123" });

    // When
    render(<PostDetailError error={error} reset={jest.fn()} />);

    // Then
    expect(screen.getByText(/abc123/)).toBeInTheDocument();
  });
});
