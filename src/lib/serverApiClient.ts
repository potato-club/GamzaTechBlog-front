import "server-only";

import { Configuration, DefaultApi } from "@/generated/api";
import { cookies } from "next/headers";

const backendFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(options.headers);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("authorization")?.value;

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (options.body && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

export const createBackendApiClient = () => {
  const config = new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    fetchApi: backendFetch as typeof fetch,
  });

  return new DefaultApi(config);
};
