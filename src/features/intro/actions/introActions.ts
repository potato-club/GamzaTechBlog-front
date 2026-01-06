"use server";

import type { IntroResponse } from "@/generated/api";
import { createBackendApiClient } from "@/lib/serverApiClient";
import { withActionResult } from "@/lib/actionResult";

/**
 * Server Action: create intro.
 */
export const createIntroAction = withActionResult(
  async (content: string): Promise<IntroResponse> => {
    const api = createBackendApiClient();
    const response = await api.createIntro({
      introCreateRequest: { content },
    });

    return response.data as IntroResponse;
  }
);

/**
 * Server Action: delete intro.
 */
export const deleteIntroAction = withActionResult(
  async (introId: number): Promise<void> => {
    const api = createBackendApiClient();
    await api.deleteIntro({ introId });
  }
);
