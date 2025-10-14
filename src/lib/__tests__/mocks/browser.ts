/**
 * MSW 브라우저 설정 (브라우저 테스트 환경용)
 *
 * 브라우저 환경에서 API 모킹을 위한 Service Worker를 설정합니다.
 * 개발 환경에서 실제 API 없이 테스트할 때 사용합니다.
 */

import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// MSW Service Worker 인스턴스 생성
export const worker = setupWorker(...handlers);
