// TextEncoder/TextDecoder polyfill (Node.js 환경에서 필요)
// ⚠️ require 사용하여 즉시 실행
const { TextEncoder: NodeTextEncoder, TextDecoder: NodeTextDecoder } = require('util');
global.TextEncoder = NodeTextEncoder;
global.TextDecoder = NodeTextDecoder;

// Fetch API polyfill (Node.js 환경에서 필요 - MSW 요구사항)
const undici = require('undici');
global.fetch = undici.fetch;
global.Request = undici.Request;
global.Response = undici.Response;
global.Headers = undici.Headers;
global.FormData = undici.FormData;

// jest-dom의 커스텀 matcher 추가 (예: toBeInTheDocument)
import '@testing-library/jest-dom';

// React 19 테스트 환경 설정
global.IS_REACT_ACT_ENVIRONMENT = true;

// React 19에는 act가 export되지 않으므로 수동 구현
const customAct = (callback) => {
  let result;
  try {
    result = callback();
  } catch (error) {
    return Promise.reject(error);
  }

  if (result && typeof result.then === 'function') {
    return result.then(() => {}, (error) => { throw error; });
  }

  return Promise.resolve();
};

// react-dom/test-utils mock (React 19 호환)
jest.mock('react-dom/test-utils', () => ({
  act: customAct,
}));

// 전역 모킹 (모든 테스트에서 공통으로 사용)

// jose 라이브러리 모킹 (ESM 모듈 문제 회피)
jest.mock('jose', () => ({
  jwtVerify: jest.fn(),
  decodeJwt: jest.fn().mockReturnValue({
    exp: Math.floor(Date.now() / 1000) + 3600, // 1시간 후 만료
  }),
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock-token'),
  })),
}));

// ESM 라이브러리를 사용하는 모듈들 mock 처리
jest.mock('marked');
jest.mock('react-markdown');
jest.mock('remark-gfm');
jest.mock('remark-math');
jest.mock('rehype-katex');

// Next.js의 next/navigation 모킹
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '';
  },
}));

// 환경변수 설정 (테스트 환경)
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8080';

// MSW 서버 설정 (API 모킹)
// ⚠️ Fetch API polyfill 이후에 import해야 함
const { server } = require('./src/lib/__tests__/mocks/server');

// MSW 서버 라이프사이클
beforeAll(() => {
  // 모든 테스트 시작 전 MSW 서버 시작
  server.listen({
    onUnhandledRequest: 'warn', // 핸들러가 없는 요청은 경고만 출력
  });
});

afterEach(() => {
  // 각 테스트 후 핸들러 리셋
  server.resetHandlers();
});

afterAll(() => {
  // 모든 테스트 완료 후 MSW 서버 종료
  server.close();
});