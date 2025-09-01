/**
 * 마이페이지 메인 컴포넌트 (서버 컴포넌트)
 *
 * 서버 컴포넌트로 빠른 초기 렌더링을 제공합니다.
 * 대시보드 loading.tsx에서 페이지 레벨 로딩 UI를 담당하므로
 * 추가적인 Suspense fallback은 불필요합니다.
 *
 * - MyPageSidebarServer: 서버에서 데이터 fetch 후 즉시 렌더링
 * - MyPageTabContent: 클라이언트 컴포넌트로 독립적 상호작용
 */

import { MyPageTabContent } from "@/features/user";
import MyPageSidebarServer from "@/features/user/components/mypage/MyPageSidebar.server";

export const dynamic = "force-dynamic";

export default function MyPage() {
  console.log("Rendering MyPage Server Component");
  return (
    <div className="mt-10 flex gap-4">
      {/* 사용자 프로필 - 서버 컴포넌트로 빠른 렌더링 */}
      <MyPageSidebarServer />

      {/* 탭 콘텐츠 - 클라이언트 컴포넌트로 사용자 상호작용 */}
      <MyPageTabContent />
    </div>
  );
}
