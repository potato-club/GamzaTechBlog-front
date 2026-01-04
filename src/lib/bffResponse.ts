export type BffErrorPayload = {
  code: string;
  message: string;
  details?: unknown;
};

export type BffSuccessPayload<T> = {
  success: true;
  data: T;
  error: null;
};

export type BffFailurePayload = {
  success: false;
  data: null;
  error: BffErrorPayload;
};

export type BffResponse<T> = BffSuccessPayload<T> | BffFailurePayload;

export const createSuccessPayload = <T>(data: T): BffSuccessPayload<T> => {
  return { success: true, data, error: null };
};

export const createErrorPayload = (
  code: string,
  message: string,
  details?: unknown
): BffFailurePayload => {
  return { success: false, data: null, error: { code, message, details } };
};
