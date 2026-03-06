import { logoutAction } from "@/features/auth/actions/logoutAction";

export const authService = {
  async logout(): Promise<void> {
    await logoutAction();
  },
};
