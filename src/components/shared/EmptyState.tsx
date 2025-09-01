import React from "react";

interface EmptyStateProps {
  /**
   * 표시할 아이콘 JSX 요소
   */
  icon: React.ReactNode;
  /**
   * 메인 제목 텍스트
   */
  title: string;
  /**
   * 설명 텍스트
   */
  description: string;
  /**
   * 추가 CSS 클래스명
   */
  className?: string;
}

/**
 * 빈 상태를 표시하는 공통 컴포넌트
 *
 * 일관된 스타일과 구조로 Empty State UI를 제공합니다.
 * 각 컨텍스트에 맞는 아이콘, 제목, 설명을 props로 받아 재사용 가능합니다.
 */
export default function EmptyState({ icon, title, description, className = "" }: EmptyStateProps) {
  return (
    <div className={`mt-12 text-center ${className}`} role="region" aria-label="빈 상태">
      <div className="mb-4 text-gray-400" aria-hidden="true">
        {icon}
      </div>
      <p className="mb-2 text-lg text-gray-500">{title}</p>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
