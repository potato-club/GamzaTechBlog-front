/**
 * 공개 프로필 페이지 로딩 UI
 *
 * 공개 프로필 페이지가 로딩 중일 때 표시되는 스켈레톤 UI입니다.
 * 기존 마이페이지와 동일한 레이아웃 구조를 유지합니다.
 */

import MyPageSidebarSkeleton from "../../../../components/shared/skeletons/MyPageSidebarSkeleton";

export default function PublicProfileLoading() {
  return <MyPageSidebarSkeleton />;
}
