import "server-only";

import type { PendingUserResponse } from "@/generated/api/models";
import { createBackendApiClient } from "@/lib/serverApiClient";

export const createAdminServiceServer = () => {
  const api = createBackendApiClient();

  return {
    async getPendingUsers(): Promise<PendingUserResponse[]> {
      const response = await api.getPendingUsers();
      return (response.data as PendingUserResponse[]) || [];
    },
  };
};
