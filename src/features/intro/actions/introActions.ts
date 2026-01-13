"use server";

import type { IntroResponse } from "@/generated/api";
import { withActionResult } from "@/lib/actionResult";
import { createBackendApiClient } from "@/lib/serverApiClient";
import { introCacheInvalidation } from "../utils/cacheInvalidation";

export const createIntroAction = withActionResult(
  async (content: string): Promise<IntroResponse> => {
    const api = createBackendApiClient();
    const response = await api.createIntro({
      introCreateRequest: { content },
    });

    introCacheInvalidation.invalidateList();
    return response.data as IntroResponse;
  }
);

export const deleteIntroAction = withActionResult(async (introId: number): Promise<void> => {
  const api = createBackendApiClient();
  await api.deleteIntro({ introId });
  introCacheInvalidation.invalidateList();
});
