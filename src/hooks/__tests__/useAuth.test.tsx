import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { UserProfileResponse } from "@/generated/api/models";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";

const routerRefreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: routerRefreshMock,
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("@/lib/tokenManager", () => ({
  performLogout: jest.fn(),
}));

jest.mock("@/features/auth", () => ({
  authService: {
    logout: jest.fn(),
  },
}));

const { performLogout } = jest.requireMock("@/lib/tokenManager") as {
  performLogout: jest.Mock;
};
const { authService } = jest.requireMock("@/features/auth") as {
  authService: { logout: jest.Mock };
};

function mockMe(body: { role: string | null; profile: UserProfileResponse | null }) {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => body,
  });
}

function AuthHookProbe() {
  const { isLoggedIn, needsProfileCompletion, userProfile, logout } = useAuth();

  return (
    <div>
      <span data-testid="logged-in">{String(isLoggedIn)}</span>
      <span data-testid="needs-profile">{String(needsProfileCompletion)}</span>
      <span data-testid="nickname">{userProfile?.nickname ?? ""}</span>
      <button type="button" onClick={() => logout()}>
        logout
      </button>
    </div>
  );
}

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("PRE_REGISTER 역할이면 프로필을 비워야 함", async () => {
    // Given: 부트스트랩이 PRE_REGISTER를 반환
    mockMe({ role: "PRE_REGISTER", profile: { nickname: "tester", role: "PRE_REGISTER" } });

    // When
    render(
      <AuthProvider>
        <AuthHookProbe />
      </AuthProvider>
    );

    // Then
    await waitFor(() => {
      expect(screen.getByTestId("logged-in")).toHaveTextContent("true");
    });
    expect(screen.getByTestId("needs-profile")).toHaveTextContent("true");
    expect(screen.getByTestId("nickname")).toHaveTextContent("");
  });

  it("일반 로그인 상태면 프로필을 그대로 노출해야 함", async () => {
    // Given
    const profile: UserProfileResponse = { nickname: "dev", role: "USER" };
    mockMe({ role: "USER", profile });

    // When
    render(
      <AuthProvider>
        <AuthHookProbe />
      </AuthProvider>
    );

    // Then
    await waitFor(() => {
      expect(screen.getByTestId("nickname")).toHaveTextContent("dev");
    });
    expect(screen.getByTestId("logged-in")).toHaveTextContent("true");
    expect(screen.getByTestId("needs-profile")).toHaveTextContent("false");
  });

  it("logout 호출 시 performLogout 후 인증 상태를 다시 조회해야 함", async () => {
    // Given: 로그인 상태로 부트스트랩
    (performLogout as jest.Mock).mockResolvedValue(undefined);
    (authService.logout as jest.Mock).mockResolvedValue(undefined);
    mockMe({ role: "USER", profile: { nickname: "dev", role: "USER" } });

    render(
      <AuthProvider>
        <AuthHookProbe />
      </AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("nickname")).toHaveTextContent("dev");
    });

    // When: 로그아웃 후 재조회는 비로그인을 반환
    mockMe({ role: null, profile: null });
    fireEvent.click(screen.getByRole("button", { name: "logout" }));

    // Then: 백엔드 로그아웃 + 클라 컨텍스트 재조회 + server-dynamic 재검증
    await waitFor(() => {
      expect(performLogout).toHaveBeenCalledWith(authService.logout);
      expect(routerRefreshMock).toHaveBeenCalled();
      expect(screen.getByTestId("logged-in")).toHaveTextContent("false");
    });
  });
});
