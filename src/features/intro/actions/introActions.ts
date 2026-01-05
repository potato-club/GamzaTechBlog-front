"use server";

import type { IntroResponse } from "@/generated/api";
import { createBackendApiClient } from "@/lib/serverApiClient";

/**
 * Server Action: create intro.
 */
export async function createIntroAction(content: string): Promise<IntroResponse> {
  const api = createBackendApiClient();
  const response = await api.createIntro({
    introCreateRequest: { content },
  });

  return response.data as IntroResponse;
}

/**
 * Server Action: delete intro.
 */
export async function deleteIntroAction(introId: number): Promise<void> {
  const api = createBackendApiClient();
  await api.deleteIntro({ introId });
}
