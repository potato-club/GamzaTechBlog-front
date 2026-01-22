/**
 * Orval용 커스텀 Fetcher
 *
 * Orval에서 생성된 API 함수들이 사용하는 fetcher입니다.
 * 서버/클라이언트 환경 모두에서 동작하며, 인증 토큰 처리를 포함합니다.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type OrvalFetcherOptions = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: HeadersInit;
  params?: Record<string, unknown>;
  data?: unknown;
  signal?: AbortSignal;
};

/**
 * 쿼리 파라미터를 URL에 추가합니다.
 */
function buildUrlWithParams(baseUrl: string, params?: Record<string, unknown>): string {
  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Orval에서 사용하는 커스텀 fetcher
 *
 * @example
 * // orval.config.ts에서 설정
 * override: {
 *   mutator: {
 *     path: './src/lib/orvalFetcher.ts',
 *     name: 'orvalFetcher',
 *   },
 * }
 */
export async function orvalFetcher<T>(options: OrvalFetcherOptions): Promise<T> {
  const { url, method, headers: customHeaders, params, data, signal } = options;

  const executeRequest = async (): Promise<Response> => {
    const fullUrl = buildUrlWithParams(`${API_BASE_URL}${url}`, params);
    const headers = new Headers(customHeaders);

    if (data && !headers.has("Content-Type") && !(data instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const requestInit: RequestInit = {
      method,
      headers,
      signal,
      credentials: "include",
    };

    if (data) {
      requestInit.body = data instanceof FormData ? data : JSON.stringify(data);
    }

    return fetch(fullUrl, requestInit);
  };

  const handleResponse = async (response: Response): Promise<T> => {
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
  };

  const response = await executeRequest();

  if (response.status === 401 && typeof window !== "undefined") {
    const refreshed = await handleTokenRefresh();
    if (refreshed) {
      const retryResponse = await executeRequest();
      return handleResponse(retryResponse);
    }
    window.location.href = "/login";
  }

  return handleResponse(response);
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  if (!API_BASE_URL) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/reissue`, {
      method: "POST",
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.warn("Failed to refresh token:", error);
    return false;
  }
}

async function handleTokenRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = refreshToken();

  try {
    return await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

export default orvalFetcher;
