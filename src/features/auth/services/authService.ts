import { apiFetch } from "@/lib/apiFetch";

export const authService = {
  async logout(): Promise<void> {
    const response = await apiFetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },
};
