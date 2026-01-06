import { forwardLikeRequest } from "../../_proxy";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: { postId: string } }
): Promise<Response> {
  const { postId: postIdParam } = await Promise.resolve(context.params);
  const url = new URL(request.url);
  const fallbackPostId = url.pathname.split("/").filter(Boolean).at(-2);
  const rawPostId = postIdParam ?? fallbackPostId;
  const postId = Number(rawPostId);

  if (!rawPostId || !Number.isFinite(postId) || postId <= 0) {
    return new Response("Invalid postId.", { status: 400 });
  }

  return forwardLikeRequest(request, `/api/v1/likes/${postId}/liked`);
}
