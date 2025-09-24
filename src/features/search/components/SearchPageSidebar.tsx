"use client";

/**
 * 검색 페이지 사이드바 컴포넌트
 *
 * 메인 페이지 사이드바에서 TagSection을 제외한 버전
 * TagContext가 필요하지 않는 검색 페이지에서 사용
 */

import { PopularPostList } from "@/features/posts";

export default function SearchPageSidebar() {
  return (
    <aside className="ml-10 hidden flex-1 border-l border-[#D5D9E3] pl-10 md:block">
      {/*
        인기 게시글만 표시:
        - PopularPostList: 인기 게시글을 자동으로 로드하고 캐싱

        TagSection은 제외하여 TagContext 의존성 없음

        데스크톱 전용: 기존 좌측 경계선과 패딩 복원
        모바일에서는 숨김, 데스크톱에서만 표시
      */}
      <PopularPostList />
    </aside>
  );
}
