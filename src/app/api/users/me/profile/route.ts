import { forwardUserRequest } from "@/app/api/users/_proxy";

export async function GET(request: Request) {
  return forwardUserRequest(request, "/api/v1/users/me/get/profile");
}
