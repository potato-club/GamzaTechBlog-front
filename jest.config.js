const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Next.js 앱의 경로
  dir: './',
});

const customJestConfig = {
  // 테스트 환경 설정
  testEnvironment: 'jest-environment-jsdom',

  // 테스트 전에 실행할 설정 파일
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // 모듈 경로 별칭 설정 (tsconfig.json의 paths와 동일하게)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // 테스트 파일 찾는 패턴
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // 커버리지 수집할 파일
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/generated/**',
  ],

  // 테스트에서 제외할 경로
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],

  // 모듈 변환 제외
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};

// Next.js가 제공하는 설정과 커스텀 설정 병합
module.exports = createJestConfig(customJestConfig);