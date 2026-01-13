import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

/**
 * 서버 컴포넌트에서 사용하는 QueryClient 싱글톤
 *
 * React의 cache()를 사용하여 요청당 하나의 QueryClient를 유지합니다.
 * 서버 컴포넌트에서 prefetchQuery와 HydrationBoundary에 사용됩니다.
 *
 * @example
 * ```tsx
 * // 서버 컴포넌트에서 사용
 * import { getQueryClient } from "@/lib/getQueryClient";
 * import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
 *
 * export default async function Page() {
 *   const queryClient = getQueryClient();
 *   await queryClient.prefetchQuery({...});
 *
 *   return (
 *     <HydrationBoundary state={dehydrate(queryClient)}>
 *       <ClientComponent />
 *     </HydrationBoundary>
 *   );
 * }
 * ```
 */
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1분
          gcTime: 5 * 60 * 1000, // 5분 (기존 cacheTime)
        },
      },
    })
);
