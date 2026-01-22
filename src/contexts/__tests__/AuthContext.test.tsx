import { render, screen } from "@testing-library/react";
import type { UserProfileResponse } from "@/generated/orval/models";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";

function AuthProbe() {
  const { userRole, userProfile } = useAuthContext();
  return (
    <div
      data-testid="auth-probe"
      data-role={userRole ?? ""}
      data-nickname={userProfile?.nickname ?? ""}
    />
  );
}

describe("AuthContext", () => {
  it("Provider 없이 사용하면 기본값(null)을 반환해야 함", () => {
    // When
    render(<AuthProbe />);

    // Then
    const probe = screen.getByTestId("auth-probe");
    expect(probe).toHaveAttribute("data-role", "");
    expect(probe).toHaveAttribute("data-nickname", "");
  });

  it("Provider에서 전달한 값을 노출해야 함", () => {
    // Given
    const profile: UserProfileResponse = {
      nickname: "tester",
      role: "USER",
    };

    // When
    render(
      <AuthProvider initialUserRole="USER" initialUserProfile={profile}>
        <AuthProbe />
      </AuthProvider>
    );

    // Then
    const probe = screen.getByTestId("auth-probe");
    expect(probe).toHaveAttribute("data-role", "USER");
    expect(probe).toHaveAttribute("data-nickname", "tester");
  });
});
