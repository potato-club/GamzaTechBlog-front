import { Skeleton } from "@/components/ui/skeleton";

/**
 * 마이페이지 사이드바 전용 스켈레톤
 *
 * 탭 콘텐츠는 각 탭별 개별 스켈레톤이 처리하므로
 * 사이드바(프로필 정보) 영역만 스켈레톤으로 표시합니다.
 */
export default function MyPageSidebarSkeleton() {
  return (
    <aside
      className="flex w-64 flex-col items-center bg-white py-10 pr-8"
      role="status"
      aria-label="프로필 정보 로딩중"
    >
      {/* 프로필 이미지 */}
      <Skeleton className="mb-4 h-28 w-28 rounded-full !bg-gray-200" />

      {/* 닉네임 */}
      <Skeleton className="mb-2 h-6 w-32 !bg-gray-200" />

      {/* 감자 기수 */}
      <Skeleton className="mb-1 h-4 w-20 !bg-gray-200" />

      {/* 이메일 */}
      <Skeleton className="mb-6 h-4 w-40 !bg-gray-200" />

      {/* 프로필 수정 버튼 */}
      <Skeleton className="mb-10 h-8 w-24 rounded !bg-gray-200" />

      {/* 활동 통계 */}
      <div className="w-full space-y-3">
        <div className="flex justify-around">
          <Skeleton className="h-12 w-16 !bg-gray-200" />
          <Skeleton className="h-12 w-16 !bg-gray-200" />
          <Skeleton className="h-12 w-16 !bg-gray-200" />
        </div>
      </div>
    </aside>
  );
}
