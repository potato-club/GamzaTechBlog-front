/**
 * MSW 서버 설정 (Node.js 테스트 환경용)
 *
 * Jest 테스트에서 사용할 MSW 서버를 설정합니다.
 */

import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// MSW 서버 인스턴스 생성
export const server = setupServer(...handlers);
