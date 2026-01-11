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
  });

  it("PRE_REGISTER 역할이면 프로필을 비워야 함", () => {
    // Given
    const profile: UserProfileResponse = { nickname: "tester", role: "PRE_REGISTER" };

    // When
    render(
      <AuthProvider initialUserRole="PRE_REGISTER" initialUserProfile={profile}>
        <AuthHookProbe />
      </AuthProvider>
    );

    // Then
    expect(screen.getByTestId("logged-in")).toHaveTextContent("true");
    expect(screen.getByTestId("needs-profile")).toHaveTextContent("true");
    expect(screen.getByTestId("nickname")).toHaveTextContent("");
  });

  it("일반 로그인 상태면 프로필을 그대로 노출해야 함", () => {
    // Given
    const profile: UserProfileResponse = { nickname: "dev", role: "USER" };

    // When
    render(
      <AuthProvider initialUserRole="USER" initialUserProfile={profile}>
        <AuthHookProbe />
      </AuthProvider>
    );

    // Then
    expect(screen.getByTestId("logged-in")).toHaveTextContent("true");
    expect(screen.getByTestId("needs-profile")).toHaveTextContent("false");
    expect(screen.getByTestId("nickname")).toHaveTextContent("dev");
  });

  it("logout 호출 시 performLogout과 refresh를 실행해야 함", async () => {
    // Given
    (performLogout as jest.Mock).mockResolvedValue(undefined);
    (authService.logout as jest.Mock).mockResolvedValue(undefined);

    render(
      <AuthProvider initialUserRole="USER" initialUserProfile={{ nickname: "dev" }}>
        <AuthHookProbe />
      </AuthProvider>
    );

    // When
    fireEvent.click(screen.getByRole("button", { name: "logout" }));

    // Then
    await waitFor(() => {
      expect(performLogout).toHaveBeenCalledWith(authService.logout);
      expect(routerRefreshMock).toHaveBeenCalledTimes(1);
    });
  });
});
