import "server-only";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function forwardAuthRequest(request: Request, path: string): Promise<Response> {
  if (!API_BASE_URL) {
    return new Response("API base URL is not configured.", { status: 500 });
  }

  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");

  if (cookie) headers.set("cookie", cookie);
  if (contentType) headers.set("content-type", contentType);

  if (authorization) {
    headers.set("authorization", authorization);
  } else {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("authorization")?.value;
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
  }

  const body =
    request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();

  return fetch(`${API_BASE_URL}${path}`, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });
}
