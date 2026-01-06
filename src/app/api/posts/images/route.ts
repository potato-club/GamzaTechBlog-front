import { forwardPostRequest } from "../_proxy";

export async function POST(request: Request) {
  return forwardPostRequest(request, "/api/v1/posts/images");
}
