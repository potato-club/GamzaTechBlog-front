import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type {
  ProfileImageResponse,
  UpdateProfileRequest,
  UserProfileRequest,
  UserProfileResponse,
} from "@/generated/api";
import { USER_QUERY_KEYS } from "@/features/user/queryKeys";
import {
  useUpdateProfile,
  useUpdateProfileImage,
  useUpdateProfileInSignup,
  useWithdrawAccount,
} from "@/features/user/hooks/useUserMutations";

jest.mock("@/features/user/actions/userActions", () => ({
  updateProfileAction: jest.fn(),
  updateProfileImageAction: jest.fn(),
  updateProfileInSignupAction: jest.fn(),
  withdrawAccountAction: jest.fn(),
}));

jest.mock("@/lib/tokenManager", () => ({
  handleTokenExpiration: jest.fn(),
}));

const { updateProfileAction, updateProfileImageAction, updateProfileInSignupAction, withdrawAccountAction } =
  jest.requireMock("@/features/user/actions/userActions") as {
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
  beforeAll(() => {
    if (!("createObjectURL" in URL)) {
      Object.defineProperty(URL, "createObjectURL", {
        value: jest.fn(() => "blob:preview"),
        writable: true,
      });
    }
    if (!("revokeObjectURL" in URL)) {
      Object.defineProperty(URL, "revokeObjectURL", {
        value: jest.fn(),
        writable: true,
      });
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("회원가입 프로필 업데이트 성공 시 캐시를 갱신해야 함", async () => {
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

    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

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
      expect(queryClient.getQueryData(USER_QUERY_KEYS.profile())).toEqual(updated);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: USER_QUERY_KEYS.activityStats() });
    });
  });

  it("프로필 업데이트 성공 시 캐시를 갱신해야 함", async () => {
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

    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

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
      expect(queryClient.getQueryData(USER_QUERY_KEYS.profile())).toEqual(updated);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: USER_QUERY_KEYS.activityStats() });
    });
  });

  it("프로필 이미지 업데이트 성공 시 미리보기 URL을 정리하고 캐시를 갱신해야 함", async () => {
    // Given
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    const response: ProfileImageResponse = { imageUrl: "https://example.com/avatar.png" };
    updateProfileImageAction.mockResolvedValue({ success: true, data: response });

    const { queryClient, Wrapper } = createWrapper();
    queryClient.setQueryData(USER_QUERY_KEYS.profile(), {
      nickname: "tester",
      profileImageUrl: "https://example.com/old.png",
    } as UserProfileResponse);

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
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview");
      expect(queryClient.getQueryData<UserProfileResponse>(USER_QUERY_KEYS.profile()))
        .toMatchObject({ profileImageUrl: response.imageUrl });
    });
  });

  it("회원 탈퇴 성공 시 토큰 만료 처리를 호출해야 함", async () => {
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
