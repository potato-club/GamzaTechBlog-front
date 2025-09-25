/**
 * 개발 환경에서만 동작하는 logger
 * 프로덕션에서는 자동으로 무시됩니다
 */
export const logger = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // error는 프로덕션에서도 유지
    console.error(...args);
  },
  /**
   * 보안이 중요한 에러 로깅
   * 프로덕션에서는 일반적인 메시지만, 개발환경에서는 상세 정보도 출력
   */
  secureError: (publicMessage: string, sensitiveDetails?: unknown) => {
    console.error(publicMessage);
    if (process.env.NODE_ENV === "development" && sensitiveDetails) {
      console.error("Debug details:", sensitiveDetails);
    }
  },
  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      console.info(...args);
    }
  },
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(...args);
    }
  },
};
