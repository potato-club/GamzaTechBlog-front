/**
 * 타입 가드 함수들
 * 런타임에서 타입 안전성을 보장하기 위한 유틸리티 함수들
 */

/**
 * 문자열 배열인지 확인하는 타입 가드
 */
export const isValidStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
};

/**
 * 태그 배열인지 확인하는 타입 가드
 */
export const isValidTagArray = (tags: unknown): tags is string[] => {
  return isValidStringArray(tags) && tags.length <= 2;
};

/**
 * 빈 문자열이 아닌지 확인하는 타입 가드
 */
export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

/**
 * 유효한 이메일 형식인지 확인하는 타입 가드
 */
export const isValidEmail = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

/**
 * 숫자인지 확인하는 타입 가드
 */
export const isValidNumber = (value: unknown): value is number => {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
};

/**
 * 양의 정수인지 확인하는 타입 가드
 */
export const isPositiveInteger = (value: unknown): value is number => {
  return isValidNumber(value) && value > 0 && Number.isInteger(value);
};
