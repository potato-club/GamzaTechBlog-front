export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export const ERROR_CODES = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  NOT_FOUND: "NOT_FOUND",
} as const;

export function handleActionError(error: unknown): ActionResult<never> {
  console.error("Server Action Error:", error);

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      code: ERROR_CODES.UNKNOWN_ERROR,
    };
  }

  return {
    success: false,
    error: "알 수 없는 오류가 발생했습니다.",
    code: ERROR_CODES.UNKNOWN_ERROR,
  };
}

export function createSuccessResult<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function withActionResult<Args extends unknown[], T>(
  action: (...args: Args) => Promise<T>
) {
  return async (...args: Args): Promise<ActionResult<T>> => {
    try {
      const data = await action(...args);
      return createSuccessResult(data);
    } catch (error) {
      return handleActionError(error);
    }
  };
}
