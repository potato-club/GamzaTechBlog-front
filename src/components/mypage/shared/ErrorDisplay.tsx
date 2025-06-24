/**
 * 마이페이지 공통 에러 표시 컴포넌트
 * 
 * 탭별로 중복되던 에러 UI를 통합하여 관리합니다.
 * 일관된 에러 처리와 사용자 경험을 제공합니다.
 */

interface ErrorDisplayProps {
  /**
   * 에러 제목 (예: "게시글을 불러올 수 없습니다")
   */
  title: string;

  /**
   * 에러 객체
   */
  error: Error;

  /**
   * 재시도 버튼 클릭 핸들러 (선택사항)
   */
  onRetry?: () => void;
}

export default function ErrorDisplay({ title, error, onRetry }: ErrorDisplayProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // 기본 동작: 페이지 새로고침
      window.location.reload();
    }
  };

  return (
    <div className="mt-8 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
        {/* 에러 아이콘 */}
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* 에러 제목 */}
        <p className="text-red-700 font-medium mb-2">
          {title}
        </p>

        {/* 에러 메시지 */}
        <p className="text-red-600 text-sm mb-4">
          {error.message}
        </p>

        {/* 재시도 버튼 */}
        <button
          onClick={handleRetry}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="페이지 새로고침"
        >
          새로고침
        </button>
      </div>
    </div>
  );
}
