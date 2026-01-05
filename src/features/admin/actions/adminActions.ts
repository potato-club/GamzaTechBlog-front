"use server";

import { createBackendApiClient } from "@/lib/serverApiClient";

/**
 * Server Action: approve user profile.
 */
export async function approveUserAction(userId: number): Promise<void> {
  const api = createBackendApiClient();
  await api.approveUserProfile({ id: userId });
}
