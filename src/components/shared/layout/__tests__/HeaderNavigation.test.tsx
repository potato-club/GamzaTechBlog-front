import { render, screen, waitFor } from "@testing-library/react";
import type { UserProfileResponse } from "@/generated/api/models";
import { HeaderNavigation } from "@/components/shared/layout/HeaderNavigation";

const pushMock = jest.fn();
let currentPathname = "/";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => currentPathname,
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/hooks/useLoadingDots", () => ({
  useLoadingDots: () => "...",
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ComponentProps<"img">) => <img {...props} />,
}));

jest.mock("@/components/shared/navigation/DropdownMenuList", () => ({
  DropdownMenuList: () => <div data-testid="dropdown-menu" />,
}));

const useAuthMock = jest.requireMock("@/hooks/useAuth").useAuth as jest.Mock;

describe("HeaderNavigation", () => {
  const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    currentPathname = "/";
  });

  it("로그인되지 않은 경우 로그인 버튼을 노출해야 함", () => {
    useAuthMock.mockReturnValue({
      isLoggedIn: false,
      userProfile: null,
      isLoading: false,
      needsProfileCompletion: false,
      logout: jest.fn(),
      refetchAuthStatus: jest.fn(),
    });

    render(<HeaderNavigation />);

    expect(screen.getByText(/Login with/i)).toBeInTheDocument();
    expect(screen.getByAltText("GitHub")).toBeInTheDocument();
  });

  it("로그인된 경우 글쓰기 버튼을 노출해야 함", () => {
    const profile: UserProfileResponse = {
      nickname: "writer",
      role: "USER",
    };

    useAuthMock.mockReturnValue({
      isLoggedIn: true,
      userProfile: profile,
      isLoading: false,
      needsProfileCompletion: false,
      logout: jest.fn(),
      refetchAuthStatus: jest.fn(),
    });

    render(<HeaderNavigation />);

    expect(screen.getByText("글쓰기")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  it("PRE_REGISTER 상태면 /signup으로 이동해야 함", async () => {
    useAuthMock.mockReturnValue({
      isLoggedIn: true,
      userProfile: null,
      isLoading: false,
      needsProfileCompletion: true,
      logout: jest.fn(),
      refetchAuthStatus: jest.fn(),
    });

    render(<HeaderNavigation />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/signup");
    });
  });
});
