import "server-only";

import type { Pageable, PagedResponseIntroResponse } from "@/generated/api";
import { createBackendApiClient } from "@/lib/serverApiClient";

type NextOptions = { revalidate?: number | false; tags?: string[] };
type RequestInitWithNext = RequestInit & { next?: NextOptions };

const mergeNextOptions = (
  baseOptions: RequestInitWithNext | undefined,
  defaultTags: string[]
): RequestInitWithNext => {
  const existingTags = baseOptions?.next?.tags || [];
  return {
    ...baseOptions,
    next: {
      ...baseOptions?.next,
      tags: [...defaultTags, ...existingTags],
    },
  };
};

export const createIntroServiceServer = () => {
  const api = createBackendApiClient();

  return {
    async getIntroList(
      params?: Pageable,
      options?: RequestInitWithNext
    ): Promise<PagedResponseIntroResponse> {
      const mergedOptions = mergeNextOptions(options, ["intros-list"]);
      const response = await api.getIntroList(params || {}, mergedOptions);
      return response.data as PagedResponseIntroResponse;
    },
  };
};
