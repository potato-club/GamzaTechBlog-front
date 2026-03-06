"use client";

/**
 * 최적화된 Link 컴포넌트
 *
 * Next.js Link를 감싸서 공통 props/스타일을 제공하는 래퍼입니다.
 * 데이터 프리페치는 RSC 전환에 맞춰 제거했습니다.
 */

import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

interface OptimizedLinkProps extends Omit<LinkProps, "href"> {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
}

export default function OptimizedLink({
  href,
  children,
  className,
  prefetch = true,
  ...props
}: OptimizedLinkProps) {
  return (
    <Link href={href} className={className} prefetch={prefetch} {...props}>
      {children}
    </Link>
  );
}

/**
 * 게시글 카드용 Link
 */
type PostLinkProps = Omit<OptimizedLinkProps, "prefetch">;

export function PostLink({ href, children, ...props }: PostLinkProps) {
  return (
    <Link href={href} prefetch={true} {...props}>
      {children}
    </Link>
  );
}
