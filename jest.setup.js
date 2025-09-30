// jest-dom의 커스텀 matcher 추가 (예: toBeInTheDocument)
import '@testing-library/jest-dom';

// TextEncoder/TextDecoder polyfill (Node.js 환경에서 필요)
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

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