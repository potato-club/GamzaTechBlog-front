import { useCallback, useState } from "react";

export type ActionMutationOptions<TData, TVariables> = {
  onSuccess?: (data: TData, variables: TVariables | undefined) => void;
  onError?: (error: Error, variables: TVariables | undefined) => void;
  onSettled?: (
    data: TData | undefined,
    error: Error | null,
    variables: TVariables | undefined
  ) => void;
};

export function useActionMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: ActionMutationOptions<TData, TVariables>
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = useCallback(
    async (variables?: TVariables) => {
      setIsPending(true);
      setError(null);

      try {
        const data = await mutationFn(variables as TVariables);
        options?.onSuccess?.(data, variables);
        options?.onSettled?.(data, null, variables);
        return data;
      } catch (err) {
        const resolvedError = err instanceof Error ? err : new Error("Unknown error");
        setError(resolvedError);
        options?.onError?.(resolvedError, variables);
        options?.onSettled?.(undefined, resolvedError, variables);
        throw resolvedError;
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn, options]
  );

  const mutate = useCallback(
    (variables?: TVariables) => {
      void mutateAsync(variables);
    },
    [mutateAsync]
  );

  return { mutate, mutateAsync, isPending, error };
}
