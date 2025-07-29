"use client";

/**
 * 메인 페이지 사이드바 컴포넌트
 * 
 * TanStack Query를 사용하여 인기 게시글과 태그 데이터를 
 * 자동으로 관리하는 컴포넌트들을 포함합니다.
 */

import PopularPostList from '../../features/posts/PopularPostList';
import TagSection from "../../TagSection";

export default function MainPageSidebar() {
  return (
    <aside className="flex-1 ml-10 border-l border-[#F2F4F6] pl-10">
      {/* 
        TanStack Query 기반 컴포넌트들:
        - PopularPostList: 인기 게시글을 자동으로 로드하고 캐싱
        - TagSection: 태그 목록을 자동으로 로드하고 캐싱
        
        각 컴포넌트는 독립적으로 데이터를 관리하며 
        로딩/에러 상태를 개별적으로 처리합니다.
      */}
      <PopularPostList />
      <TagSection />
    </aside>
  );
}