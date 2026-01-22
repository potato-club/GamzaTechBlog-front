"use server";

import type { IntroResponse, ResponseDtoIntroResponse } from "@/generated/orval/models";
import { withActionResult } from "@/lib/actionResult";
import { serverApiFetchJson } from "@/lib/serverApiFetch";
import { introCacheInvalidation } from "../utils/cacheInvalidation";

export const createIntroAction = withActionResult(
  async (content: string): Promise<IntroResponse> => {
    const payload = await serverApiFetchJson<ResponseDtoIntroResponse>("/api/v1/intros", {
      method: "POST",
      body: JSON.stringify({ content }),
    });

    if (!payload.data) {
      throw new Error("Intro response data is missing.");
    }

    introCacheInvalidation.invalidateList();
    return payload.data;
  }
);

export const deleteIntroAction = withActionResult(async (introId: number): Promise<void> => {
  await serverApiFetchJson(`/api/v1/intros/${introId}`, {
    method: "DELETE",
  });
  introCacheInvalidation.invalidateList();
});
