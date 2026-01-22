import "server-only";

import type { Pageable, PagedResponseIntroResponse } from "@/generated/orval/models";
import type { ResponseDtoPagedResponseIntroResponse } from "@/generated/orval/models";
import { serverApiFetchJson } from "@/lib/serverApiFetch";

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
  return {
    async getIntroList(
      params?: Pageable,
      options?: RequestInitWithNext
    ): Promise<PagedResponseIntroResponse> {
      const mergedOptions = mergeNextOptions(options, ["intros-list"]);
      const searchParams = new URLSearchParams();

      if (typeof params?.page === "number") {
        searchParams.set("page", params.page.toString());
      }
      if (typeof params?.size === "number") {
        searchParams.set("size", params.size.toString());
      }
      if (params?.sort?.length) {
        params.sort.forEach((sortKey) => {
          searchParams.append("sort", sortKey);
        });
      }

      const query = searchParams.toString();
      const payload = await serverApiFetchJson<ResponseDtoPagedResponseIntroResponse>(
        `/api/v1/intros${query ? `?${query}` : ""}`,
        mergedOptions
      );

      if (!payload.data) {
        throw new Error("Intro list response data is missing.");
      }

      return payload.data;
    },
  };
};
