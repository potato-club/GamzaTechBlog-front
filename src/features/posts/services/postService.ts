import type { PostDetailResponse, ResponseDtoPostDetailResponse } from "@/generated/api";
import { apiFetch } from "@/lib/apiFetch";

async function getPostById(postId: number): Promise<PostDetailResponse> {
  const response = await apiFetch(`/api/v1/posts/${postId}`, {
    mode: "direct-public",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch post detail (status ${response.status}).`);
  }

  const payload = (await response.json()) as ResponseDtoPostDetailResponse | null;
  if (!payload?.data) {
    throw new Error("Post detail response data is missing.");
  }

  return payload.data as PostDetailResponse;
}

export const postService = {
  getPostById,
} as const;
