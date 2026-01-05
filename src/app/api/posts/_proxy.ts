import "server-only";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function forwardPostRequest(request: Request, path: string): Promise<Response> {
  if (!API_BASE_URL) {
    return new Response("API base URL is not configured.", { status: 500 });
  }

  const headers = new Headers();
  const cookieHeader = request.headers.get("cookie");
  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");

  if (cookieHeader) headers.set("cookie", cookieHeader);

  if (authorization) {
    headers.set("authorization", authorization);
  } else {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("authorization")?.value;
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
  }

  const { search } = new URL(request.url);
  const isFormData = contentType?.includes("multipart/form-data");

  let body: BodyInit | undefined;

  if (request.method === "GET" || request.method === "HEAD") {
    body = undefined;
  } else if (isFormData) {
    body = await request.formData();
  } else {
    if (contentType) headers.set("content-type", contentType);
    body = await request.text();
  }

  return fetch(`${API_BASE_URL}${path}${search}`, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });
}
