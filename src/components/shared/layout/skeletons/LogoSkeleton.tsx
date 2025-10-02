/**
 * 로고 스켈레톤 컴포넌트
 *
 * 메인 페이지 로고 영역의 로딩 상태를 표시합니다.
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function LogoSkeleton() {
  return (
    <section className="mt-5 text-center">
      <Skeleton className="mx-auto h-[230px] w-[255px]" />
      <Skeleton className="mx-auto mt-2 h-6 w-64" />
    </section>
  );
}
