/**
 * 프로필 편집 다이얼로그 스켈레톤 컴포넌트
 *
 * ProfileEditDialog 컴포넌트의 로딩 상태를 표시합니다.
 */

export default function ProfileEditDialogSkeleton() {
  return (
    <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
      <div className="animate-pulse rounded-lg bg-white p-6">
        <div className="mb-4 h-6 w-32 rounded bg-gray-200"></div>
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
