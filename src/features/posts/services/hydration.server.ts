import { POST_QUERY_KEYS } from "@/features/posts/hooks/usePostQueries";
import type { Pageable } from "@/generated/api";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { createPostServiceServer } from "./postService.server";

interface PrefetchPostsParams {
  tag?: string;
  page: number;
  size: number;
}

export async function prefetchHomeFeed(params: PrefetchPostsParams) {
  const { tag, page, size } = params;

  const queryParams: Pageable = {
    page: page - 1,
    size,
    sort: ["createdAt,desc"],
  };

  const queryClient = new QueryClient();
  const postService = createPostServiceServer();

  await queryClient.prefetchQuery({
    queryKey: tag
      ? POST_QUERY_KEYS.postsByTag(tag, queryParams)
      : POST_QUERY_KEYS.list(queryParams),
    queryFn: () =>
      tag ? postService.getPostsByTag(tag, queryParams) : postService.getPosts(queryParams),
  });

  return dehydrate(queryClient);
}
