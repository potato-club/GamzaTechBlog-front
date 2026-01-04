import "server-only";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function forwardUserRequest(request: Request, path: string): Promise<Response> {
  if (!API_BASE_URL) {
    return new Response("API base URL is not configured.", { status: 500 });
  }

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const cookieHeader = request.headers.get("cookie");

  if (contentType) headers.set("content-type", contentType);
  if (cookieHeader) headers.set("cookie", cookieHeader);

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("authorization")?.value;

  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  const body =
    request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();
  const { search } = new URL(request.url);

  return fetch(`${API_BASE_URL}${path}${search}`, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });
}
