import MyPageContent from '@/components/mypage/MyPageContent';
import MyPageSkeleton from '@/components/mypage/MyPageSkeleton';
import { Suspense } from 'react';

export default function MyPage() {
  return (
    <Suspense fallback={<MyPageSkeleton />}>
      <MyPageContent />
    </Suspense>
  );
}