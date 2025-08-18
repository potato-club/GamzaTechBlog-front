"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * 글로벌 에러 바운더리
 *
 * Next.js에서 error.tsx는 해당 레벨과 하위 레벨에서 발생하는
 * 모든 에러를 잡아서 처리합니다.
 *
 * 사용자에게는 친근한 에러 메시지를 보여주고,
 * 개발자에게는 에러 정보를 제공합니다.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러를 콘솔에 로깅 (개발 환경에서 디버깅용)
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        {/* 에러 아이콘 */}
        <div className="mb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        {/* 에러 메시지 */}
        <h2 className="mb-4 text-2xl font-bold text-gray-900">앗! 문제가 발생했습니다</h2>

        <p className="mb-6 text-gray-600">
          일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>

        {/* 개발 환경에서만 에러 상세 정보 표시 */}
        {process.env.NODE_ENV === "development" && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              개발자 정보 (클릭하여 펼치기)
            </summary>
            <div className="mt-2 overflow-auto rounded bg-gray-100 p-3 text-xs text-gray-700">
              <p>
                <strong>에러:</strong> {error.message}
              </p>
              {error.digest && (
                <p>
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
              {error.stack && <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>}
            </div>
          </details>
        )}

        {/* 액션 버튼들 */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            다시 시도
          </button>

          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-6 py-3 text-center text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
          >
            홈으로 돌아가기
          </Link>
        </div>

        {/* 추가 도움말 */}
        <p className="mt-6 text-sm text-gray-500">
          문제가 계속 발생한다면{" "}
          <a href="mailto:support@gamzatech.site" className="text-blue-500 hover:underline">
            문의해주세요
          </a>
        </p>
      </div>
    </div>
  );
}
