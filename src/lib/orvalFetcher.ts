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

  const fullUrl = buildUrlWithParams(`${API_BASE_URL}${url}`, params);

  const headers = new Headers(customHeaders);

  // Content-Type 설정 (FormData가 아닌 경우)
  if (data && !headers.has("Content-Type") && !(data instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const requestInit: RequestInit = {
    method,
    headers,
    signal,
    credentials: "include", // 쿠키 포함 (인증용)
  };

  // Body 설정
  if (data) {
    if (data instanceof FormData) {
      requestInit.body = data;
    } else {
      requestInit.body = JSON.stringify(data);
    }
  }

  const response = await fetch(fullUrl, requestInit);

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  // 204 No Content 처리
  if (response.status === 204) {
    return undefined as T;
  }

  // JSON 응답이 아닌 경우 처리
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return (await response.text()) as T;
  }

  return response.json();
}

export default orvalFetcher;
