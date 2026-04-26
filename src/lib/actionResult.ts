import { FetchError, ResponseError } from "@/generated/api";

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

type ErrorBody = {
  message?: unknown;
  code?: unknown;
};

const getStatusErrorCode = (status: number): string => {
  if (status === 401) return ERROR_CODES.UNAUTHORIZED;
  if (status === 404) return ERROR_CODES.NOT_FOUND;

  return ERROR_CODES.UNKNOWN_ERROR;
};

async function readErrorBody(response: Response): Promise<ErrorBody | null> {
  const body = await response
    .clone()
    .json()
    .catch(() => null);

  if (body && typeof body === "object") {
    return body as ErrorBody;
  }

  return null;
}

export async function handleActionError(error: unknown): Promise<ActionResult<never>> {
  console.error("Server Action Error:", error);

  if (error instanceof FetchError) {
    return {
      success: false,
      error: "네트워크 오류가 발생했습니다.",
      code: ERROR_CODES.NETWORK_ERROR,
    };
  }

  if (error instanceof ResponseError) {
    const body = await readErrorBody(error.response);

    return {
      success: false,
      error: typeof body?.message === "string" ? body.message : error.message,
      code: typeof body?.code === "string" ? body.code : getStatusErrorCode(error.response.status),
    };
  }

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

export function withActionResult<Args extends unknown[], T>(action: (...args: Args) => Promise<T>) {
  return async (...args: Args): Promise<ActionResult<T>> => {
    try {
      const data = await action(...args);
      return createSuccessResult(data);
    } catch (error) {
      return await handleActionError(error);
    }
  };
}
