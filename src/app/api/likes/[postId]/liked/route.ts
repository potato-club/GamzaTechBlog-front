import { forwardLikeRequest } from "../../_proxy";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: { postId: string } }
): Promise<Response> {
  const { postId: postIdParam } = await Promise.resolve(context.params);
  const postId = Number(postIdParam);

  if (!postIdParam || !Number.isFinite(postId) || postId <= 0) {
    return new Response("Invalid postId.", { status: 400 });
  }

  return forwardLikeRequest(request, `/api/v1/likes/${postId}/liked`);
}
