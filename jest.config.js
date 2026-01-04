/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Next.js 앱의 경로
  dir: "./",
});

const esmModules = [
  "msw",
  "@mswjs",
  "@open-draft",
  "until-async",
  "strict-event-emitter",
  "headers-polyfill",
  "is-node-process",
  "outvariant",
  "ky", // ky는 ESM 전용 모듈
  "marked", // marked도 ESM 전용 모듈
].join("|");

const transformIgnorePatterns = [
  `/node_modules/(?!(${esmModules})/)`,
  "^.+\\.module\\.(css|sass|scss)$",
];

const isSkipMsw = ["true", "1", "yes"].includes(
  String(process.env.JEST_SKIP_MSW || "").toLowerCase()
);

const setupFilesAfterEnv = ["<rootDir>/jest.setup.js"];

if (!isSkipMsw) {
  setupFilesAfterEnv.push("<rootDir>/jest.msw.setup.js");
}

const customJestConfig = {
  // 테스트 환경 설정
  testEnvironment: "jest-environment-jsdom",

  // 테스트 전에 실행할 설정 파일
  setupFilesAfterEnv,

  // 모듈 경로 별칭 설정 (tsconfig.json의 paths와 동일하게)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // 테스트 파일 찾는 패턴
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],

  // 커버리지 수집할 파일
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/generated/**",
  ],

  // 테스트에서 제외할 경로 (mocks 폴더는 MSW 설정 파일)
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/__tests__/mocks/"],

  // 모듈 변환 제외 (MSW/ESM 의존성은 변환 허용)
  transformIgnorePatterns,
};

const getJestConfig = createJestConfig(customJestConfig);

// Next.js가 제공하는 설정과 커스텀 설정 병합
module.exports = async () => {
  const config = await getJestConfig();
  config.transformIgnorePatterns = transformIgnorePatterns;
  config.setupFilesAfterEnv = setupFilesAfterEnv;
  return config;
};
