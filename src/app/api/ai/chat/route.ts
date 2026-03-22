import "server-only";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function POST(request: Request): Promise<Response> {
  if (!API_BASE_URL) {
    return new Response("API base URL is not configured.", { status: 500 });
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("authorization")?.value;

  const headers = new Headers({ "Content-Type": "application/json" });
  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  const body = await request.text();

  return fetch(`${API_BASE_URL}/api/v1/ai/chat`, {
    method: "POST",
    headers,
    body,
  });
}
