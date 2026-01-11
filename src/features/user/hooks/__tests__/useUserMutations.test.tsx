import {
  useUpdateProfile,
  useUpdateProfileImage,
  useUpdateProfileInSignup,
  useWithdrawAccount,
} from "@/features/user/hooks/useUserMutations";
import type {
  ProfileImageResponse,
  UpdateProfileRequest,
  UserProfileRequest,
  UserProfileResponse,
} from "@/generated/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

// Mock next/navigation
const mockRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

jest.mock("@/features/user/actions/userActions", () => ({
  updateProfileAction: jest.fn(),
  updateProfileImageAction: jest.fn(),
  updateProfileInSignupAction: jest.fn(),
  withdrawAccountAction: jest.fn(),
}));

jest.mock("@/lib/tokenManager", () => ({
  handleTokenExpiration: jest.fn(),
}));

const {
  updateProfileAction,
  updateProfileImageAction,
  updateProfileInSignupAction,
  withdrawAccountAction,
} = jest.requireMock("@/features/user/actions/userActions") as {
  updateProfileAction: jest.Mock;
  updateProfileImageAction: jest.Mock;
  updateProfileInSignupAction: jest.Mock;
  withdrawAccountAction: jest.Mock;
};

const { handleTokenExpiration } = jest.requireMock("@/lib/tokenManager") as {
  handleTokenExpiration: jest.Mock;
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, Wrapper };
};

function UpdateProfileInSignupProbe({ payload }: { payload: UserProfileRequest }) {
  const mutation = useUpdateProfileInSignup();
  return (
    <button type="button" onClick={() => mutation.mutateAsync(payload)}>
      run
    </button>
  );
}

function UpdateProfileProbe({ payload }: { payload: UpdateProfileRequest }) {
  const mutation = useUpdateProfile();
  return (
    <button type="button" onClick={() => mutation.mutateAsync(payload)}>
      run
    </button>
  );
}

function UpdateProfileImageProbe({ file }: { file: File }) {
  const mutation = useUpdateProfileImage();
  return (
    <button type="button" onClick={() => mutation.mutateAsync(file)}>
      run
    </button>
  );
}

function WithdrawAccountProbe() {
  const mutation = useWithdrawAccount();
  return (
    <button type="button" onClick={() => mutation.mutateAsync()}>
      run
    </button>
  );
}

describe("useUserMutations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useUpdateProfileInSignup", () => {
    it("성공 시 액션을 호출해야 함", async () => {
      // Given
      const payload: UserProfileRequest = {
        email: "test@example.com",
        studentNumber: "20250001",
        gamjaBatch: 4,
        position: "FRONTEND",
      };
      const updated: UserProfileResponse = {
        nickname: "tester",
        email: payload.email,
        studentNumber: payload.studentNumber,
        gamjaBatch: payload.gamjaBatch,
        position: payload.position,
      };
      updateProfileInSignupAction.mockResolvedValue({ success: true, data: updated });

      const { Wrapper } = createWrapper();

      render(
        <Wrapper>
          <UpdateProfileInSignupProbe payload={payload} />
        </Wrapper>
      );

      // When
      fireEvent.click(screen.getByRole("button", { name: "run" }));

      // Then
      await waitFor(() => {
        expect(updateProfileInSignupAction).toHaveBeenCalledWith(payload);
      });

      // NOTE: 회원가입 후 리다이렉트되므로 router.refresh()는 호출하지 않음
      expect(mockRefresh).not.toHaveBeenCalled();
    });
  });

  describe("useUpdateProfile", () => {
    it("성공 시 router.refresh()를 호출해야 함", async () => {
      // Given
      const payload: UpdateProfileRequest = {
        email: "new@example.com",
        studentNumber: "20250002",
        gamjaBatch: 5,
        position: "BACKEND",
      };
      const updated: UserProfileResponse = {
        nickname: "tester",
        email: payload.email,
        studentNumber: payload.studentNumber,
        gamjaBatch: payload.gamjaBatch,
        position: payload.position,
      };
      updateProfileAction.mockResolvedValue({ success: true, data: updated });

      const { Wrapper } = createWrapper();

      render(
        <Wrapper>
          <UpdateProfileProbe payload={payload} />
        </Wrapper>
      );

      // When
      fireEvent.click(screen.getByRole("button", { name: "run" }));

      // Then
      await waitFor(() => {
        expect(updateProfileAction).toHaveBeenCalledWith(payload);
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    it("실패 시 router.refresh()를 호출하지 않아야 함", async () => {
      // Given
      const payload: UpdateProfileRequest = {
        email: "new@example.com",
        studentNumber: "20250002",
        gamjaBatch: 5,
        position: "BACKEND",
      };
      updateProfileAction.mockResolvedValue({ success: false, error: "업데이트 실패" });

      const { Wrapper } = createWrapper();

      render(
        <Wrapper>
          <UpdateProfileProbe payload={payload} />
        </Wrapper>
      );

      // When
      fireEvent.click(screen.getByRole("button", { name: "run" }));

      // Then
      await waitFor(() => {
        expect(updateProfileAction).toHaveBeenCalledWith(payload);
      });
      expect(mockRefresh).not.toHaveBeenCalled();
    });
  });

  describe("useUpdateProfileImage", () => {
    it("성공 시 router.refresh()를 호출해야 함", async () => {
      // Given
      const file = new File(["avatar"], "avatar.png", { type: "image/png" });
      const response: ProfileImageResponse = { imageUrl: "https://example.com/avatar.png" };
      updateProfileImageAction.mockResolvedValue({ success: true, data: response });

      const { Wrapper } = createWrapper();

      render(
        <Wrapper>
          <UpdateProfileImageProbe file={file} />
        </Wrapper>
      );

      // When
      fireEvent.click(screen.getByRole("button", { name: "run" }));

      // Then
      await waitFor(() => {
        expect(updateProfileImageAction).toHaveBeenCalledWith(file);
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    it("실패 시 router.refresh()를 호출하지 않아야 함", async () => {
      // Given
      const file = new File(["avatar"], "avatar.png", { type: "image/png" });
      updateProfileImageAction.mockResolvedValue({ success: false, error: "업로드 실패" });

      const { Wrapper } = createWrapper();

      render(
        <Wrapper>
          <UpdateProfileImageProbe file={file} />
        </Wrapper>
      );

      // When
      fireEvent.click(screen.getByRole("button", { name: "run" }));

      // Then
      await waitFor(() => {
        expect(updateProfileImageAction).toHaveBeenCalledWith(file);
      });
      expect(mockRefresh).not.toHaveBeenCalled();
    });
  });

  describe("useWithdrawAccount", () => {
    it("성공 시 토큰 만료 처리를 호출해야 함", async () => {
      // Given
      withdrawAccountAction.mockResolvedValue({ success: true, data: undefined });
      const { queryClient, Wrapper } = createWrapper();

      render(
        <Wrapper>
          <WithdrawAccountProbe />
        </Wrapper>
      );

      // When
      fireEvent.click(screen.getByRole("button", { name: "run" }));

      // Then
      await waitFor(() => {
        expect(withdrawAccountAction).toHaveBeenCalled();
        expect(handleTokenExpiration).toHaveBeenCalledWith(queryClient, "/");
      });
    });
  });
});
