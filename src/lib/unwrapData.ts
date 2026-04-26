export function unwrapData<T>(response: { data?: T | null }): T {
  if (response.data == null) {
    throw new Error("Response data is missing.");
  }

  return response.data;
}
