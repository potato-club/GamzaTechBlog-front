import { forwardAuthRequest } from "../_proxy";

export async function POST(request: Request) {
  return forwardAuthRequest(request, "/api/auth/me/logout");
}
