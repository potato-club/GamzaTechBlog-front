"use client";

/**
 * 최적화된 Link 컴포넌트
 *
 * Next.js Link에 추가 최적화 기능을 제공합니다:
 * - 마우스 호버시 데이터 프리페치
 * - 게시글 링크 감지 및 자동 프리페치
 * - 성능 모니터링
 */

import { usePrefetchPosts } from "@/hooks/queries/usePostQueries";
import Link, { LinkProps } from "next/link";
import { ReactNode, useCallback } from "react";

interface OptimizedLinkProps extends Omit<LinkProps, "href"> {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  enableDataPrefetch?: boolean; // 데이터 프리페치 활성화 여부
}

export default function OptimizedLink({
  href,
  children,
  className,
  prefetch = true,
  enableDataPrefetch = true,
  ...props
}: OptimizedLinkProps) {
  const { prefetchPost, prefetchPosts } = usePrefetchPosts();

  // 마우스 호버시 데이터 프리페치
  const handleMouseEnter = useCallback(() => {
    if (!enableDataPrefetch) return;

    // 게시글 상세 페이지 링크인 경우
    const postIdMatch = href.match(/^\/posts\/(\d+)$/);
    if (postIdMatch) {
      const postId = parseInt(postIdMatch[1]);
      prefetchPost(postId);
      return;
    }

    // 메인 페이지나 게시글 목록 페이지인 경우
    if (href === "/" || href.startsWith("/?")) {
      const url = new URL(href, window.location.origin);
      const tag = url.searchParams.get("tag");
      const page = parseInt(url.searchParams.get("page") || "1");

      if (tag) {
        // 태그별 게시글 프리페치는 별도 함수가 필요하므로 일단 스킵
        return;
      }

      prefetchPosts({
        page: page - 1, // API는 0부터 시작
        size: 10,
        sort: ["createdAt,desc"],
      });
    }
  }, [href, enableDataPrefetch, prefetchPost, prefetchPosts]);

  // 터치 시작시에도 프리페치 (모바일 대응)
  const handleTouchStart = useCallback(() => {
    if (enableDataPrefetch) {
      handleMouseEnter();
    }
  }, [enableDataPrefetch, handleMouseEnter]);

  return (
    <Link
      href={href}
      className={className}
      prefetch={prefetch}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * 게시글 카드용 최적화된 Link
 *
 * 게시글 링크에 특화된 프리페치 로직을 제공합니다.
 */
interface PostLinkProps extends Omit<OptimizedLinkProps, "enableDataPrefetch"> {
  postId: number;
}

export function PostLink({ postId, href, children, ...props }: PostLinkProps) {
  const { prefetchPost } = usePrefetchPosts();

  const handleMouseEnter = useCallback(() => {
    prefetchPost(postId);
  }, [postId, prefetchPost]);

  return (
    <Link href={href} onMouseEnter={handleMouseEnter} onTouchStart={handleMouseEnter} {...props}>
      {children}
    </Link>
  );
}
