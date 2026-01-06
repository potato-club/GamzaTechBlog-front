"use server";

import { createBackendApiClient } from "@/lib/serverApiClient";
import { withActionResult } from "@/lib/actionResult";

/**
 * Server Action: approve user profile.
 */
export const approveUserAction = withActionResult(async (userId: number): Promise<void> => {
  const api = createBackendApiClient();
  await api.approveUserProfile({ id: userId });
});
