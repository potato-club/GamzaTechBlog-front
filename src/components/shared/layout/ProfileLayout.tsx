import { MyPageTabContent } from "@/features/user";
import MyPageSidebarServer from "@/features/user/components/mypage/MyPageSidebar.server";
import { ProfileActions } from "../ProfileActions";
import { ProfileRedirect } from "../ProfileRedirect";

interface ProfileLayoutProps {
  mode: "mypage" | "public";
  username?: string; // public 모드일 때 필요
  children?: React.ReactNode;
}

/**
 * 프로필 페이지 공통 레이아웃 컴포넌트
 *
 * 마이페이지와 공개 프로필 페이지에서 공통으로 사용되는 레이아웃을 제공합니다.
 * 모드에 따라 적절한 사이드바와 탭 콘텐츠를 렌더링합니다.
 *
 * @param mode - 'mypage' (내 프로필) 또는 'public' (공개 프로필)
 * @param username - public 모드일 때 조회할 사용자명
 * @param children - 추가 콘텐츠 (현재는 사용하지 않음)
 */
export default function ProfileLayout({ mode, username, children }: ProfileLayoutProps) {
  const isOwner = mode === "mypage";

  return (
    <>
      {/* 공개 프로필에서 본인 프로필 접근 시 자동 리다이렉트 */}
      {mode === "public" && username && <ProfileRedirect targetUsername={username} />}

      <div className="mt-10 flex gap-4">
        {/* 사용자 프로필 사이드바 */}
        <MyPageSidebarServer isOwner={isOwner} username={username} />

        {/* 탭 콘텐츠 - 통합 데이터 관리 */}
        <div className="flex-1">
          <MyPageTabContent isOwner={isOwner} username={username} />

          {/* 추가 프로필 액션 버튼들 */}
          <ProfileActions targetUsername={username || ""} mode={mode} />
        </div>

        {children}
      </div>
    </>
  );
}
