/**
 * 프로필 편집 다이얼로그 스켈레톤 컴포넌트
 *
 * @description ProfileEditDialog 컴포넌트의 로딩 상태를 표시합니다.
 * @returns {JSX.Element} ProfileEditDialog Skeleton UI
 *
 * @example
 * ```tsx
 * <ProfileEditDialogSkeleton />
 * ```
 */

import { FormSkeleton } from "@/components/shared/skeletons";

export default function ProfileEditDialogSkeleton() {
  return (
    <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
      <div className="rounded-lg bg-white p-6">
        <FormSkeleton fields={3} showButtons={true} showTitle={true} />
      </div>
    </div>
  );
}
