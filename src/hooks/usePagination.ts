"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

/**
 * URL 쿼리 파라미터 기반 페이지네이션 훅
 * 
 * URL의 ?page= 파라미터를 읽고 업데이트하여
 * 북마크, 뒤로가기, 새로고침 등을 지원합니다.
 */
export function usePagination(defaultPage = 1) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL에서 현재 페이지 읽기 (1부터 시작)
  const currentPage = parseInt(searchParams.get('page') || defaultPage.toString());

  // API 호출용 페이지 (0부터 시작)
  const currentPageForAPI = currentPage - 1;  // 페이지 변경 함수
  const setPage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page === 1) {
      // 1페이지면 page 파라미터 제거 (깔끔한 URL)
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }

    // pathname과 쿼리 파라미터를 조합한 완전한 URL 생성
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

    console.log('Navigating to:', newUrl); // 디버깅용 로그
    router.push(newUrl, { scroll: false }); // 스크롤 위치 유지
  }, [router, pathname, searchParams]);

  return {
    currentPage,           // UI용 (1부터 시작)
    currentPageForAPI,     // API용 (0부터 시작)  
    setPage
  };
}
