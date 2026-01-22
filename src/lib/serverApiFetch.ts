import "server-only";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function serverApiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const headers = new Headers(options.headers);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("authorization")?.value;

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (options.body && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
}

export async function serverApiFetchJson<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await serverApiFetch(path, options);

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return (await response.text()) as T;
  }

  return response.json();
}
