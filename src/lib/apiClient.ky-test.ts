/**
 * Ky 기반 API 클라이언트 테스트
 *
 * POC 단계에서 기존 apiClient와 병행하여 테스트합니다.
 * 검증 후 apiClient.ts에 통합됩니다.
 *
 * @see docs/ky-migration-plan.md
 */

import { Configuration, DefaultApi } from "@/generated/api";
import { kyFetchWrapper } from "./kyClient";

const kyApiConfig = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  fetchApi: kyFetchWrapper as typeof fetch,
  credentials: "include",
});

/**
 * Ky 기반 API 클라이언트 (테스트용)
 *
 * 기존 apiClient와 동일한 인터페이스를 제공하지만,
 * 내부적으로 Ky를 사용하여 HTTP 요청을 처리합니다.
 *
 * @example
 * ```typescript
 * import { kyApiClient } from '@/lib/apiClient.ky-test';
 *
 * // 기존 apiClient와 동일하게 사용
 * const profile = await kyApiClient.getCurrentUserProfile();
 * const posts = await kyApiClient.getPosts({ page: 1 });
 * ```
 */
export const kyApiClient = new DefaultApi(kyApiConfig);
