"use server";

import { serverApiFetchJson } from "@/lib/serverApiFetch";
import { withActionResult } from "@/lib/actionResult";

/**
 * Server Action: approve user profile.
 */
export const approveUserAction = withActionResult(async (userId: number): Promise<void> => {
  await serverApiFetchJson(`/api/admin/users/${userId}/approve`, {
    method: "PUT",
  });
});
