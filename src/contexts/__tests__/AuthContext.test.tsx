import { render, screen, waitFor, act } from "@testing-library/react";
import type { UserProfileResponse } from "@/generated/api/models";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";

function AuthProbe() {
  const { userRole, userProfile, isLoading, refetch } = useAuthContext();
  return (
    <div>
      <div
        data-testid="auth-probe"
        data-role={userRole ?? ""}
        data-nickname={userProfile?.nickname ?? ""}
        data-loading={String(isLoading)}
      />
      <button type="button" onClick={() => refetch()}>
        refetch
      </button>
    </div>
  );
}

function mockFetchOnce(body: { role: string | null; profile: UserProfileResponse | null }) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => body,
  });
}

describe("AuthContext (클라이언트 부트스트랩)", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Provider 없이 사용하면 기본값(null, 로딩 아님)을 반환해야 함", () => {
    // When
    render(<AuthProbe />);

    // Then
    const probe = screen.getByTestId("auth-probe");
    expect(probe).toHaveAttribute("data-role", "");
    expect(probe).toHaveAttribute("data-nickname", "");
    expect(probe).toHaveAttribute("data-loading", "false");
  });

  it("마운트 후 /api/users/me를 조회해 인증 상태를 채워야 함", async () => {
    // Given
    const profile: UserProfileResponse = { nickname: "tester", role: "USER" };
    mockFetchOnce({ role: "USER", profile });

    // When
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    // Then: 마운트 시 부트스트랩 조회가 일어난다
    expect(global.fetch).toHaveBeenCalledWith("/api/users/me", expect.anything());

    await waitFor(() => {
      const probe = screen.getByTestId("auth-probe");
      expect(probe).toHaveAttribute("data-role", "USER");
      expect(probe).toHaveAttribute("data-nickname", "tester");
      expect(probe).toHaveAttribute("data-loading", "false");
    });
  });

  it("조회 완료 전에는 isLoading이 true이고 사용자 정보가 비어야 함(정적 셸 대비)", async () => {
    // Given: 응답을 수동으로 지연시킨다
    let resolveFetch: (value: unknown) => void = () => {};
    (global.fetch as jest.Mock).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );

    // When
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    // Then: 조회 중에는 로딩 상태
    const probe = screen.getByTestId("auth-probe");
    expect(probe).toHaveAttribute("data-loading", "true");
    expect(probe).toHaveAttribute("data-role", "");

    // 응답 도착 후 정리
    await act(async () => {
      resolveFetch({ ok: true, json: async () => ({ role: null, profile: null }) });
    });
  });

  it("조회 실패 시 비로그인 상태로 폴백해야 함", async () => {
    // Given
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("network"));

    // When
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    // Then
    await waitFor(() => {
      const probe = screen.getByTestId("auth-probe");
      expect(probe).toHaveAttribute("data-role", "");
      expect(probe).toHaveAttribute("data-loading", "false");
    });
  });

  it("refetch 호출 시 인증 상태를 다시 조회해야 함", async () => {
    // Given: 최초 비로그인
    mockFetchOnce({ role: null, profile: null });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-probe")).toHaveAttribute("data-loading", "false");
    });

    // When: 재조회 시 로그인 상태로 바뀐다
    const profile: UserProfileResponse = { nickname: "later", role: "USER" };
    mockFetchOnce({ role: "USER", profile });
    await act(async () => {
      screen.getByRole("button", { name: "refetch" }).click();
    });

    // Then
    await waitFor(() => {
      expect(screen.getByTestId("auth-probe")).toHaveAttribute("data-nickname", "later");
    });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
