import { forwardUserRequest } from "../../_proxy";

export async function GET(request: Request) {
  return forwardUserRequest(request, "/api/v1/comment/me/comments");
}
