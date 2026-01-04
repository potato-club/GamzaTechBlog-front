type FetchMode = "bff" | "direct-public" | "direct-private";

export type ApiFetchOptions = RequestInit & {
  mode?: FetchMode;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const { mode = "bff", ...init } = options;

  if (mode === "bff") {
    // Same-origin credentials are the default for fetch.
    return fetch(path, init);
  }

  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const url = `${API_BASE_URL}${path}`;

  const credentials = init.credentials ?? (mode === "direct-private" ? "include" : "omit");

  return fetch(url, {
    ...init,
    credentials,
  });
}
