"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * 게시글 상세 렌더가 실패했을 때 표시되는 에러 UI
 *
 * 언제 뜨는가: 백엔드 5xx·네트워크 오류 등 **일시적** 실패.
 * 글이 확정적으로 없는 경우(404)는 not-found.tsx가 담당한다 — 이 둘을 구분하는 이유는,
 * 일시적 오류를 "글 없음"으로 렌더하면 ISR이 그 페이지를 캐시해버려 백엔드 복구 후에도
 * 잘못된 화면이 계속 서빙되기 때문이다(apiError.isNotFoundError 참고).
 *
 * 그래서 문구도 "삭제됨"이 아니라 "일시적 문제 → 다시 시도"로 안내한다.
 */
export default function PostDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("게시글 상세 렌더 실패:", error);
  }, [error]);

  return (
    <section className="mx-16 my-16">
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-gray-300">!</h1>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">일시적인 문제가 발생했습니다</h2>
          <p className="mb-4 max-w-md text-gray-600">
            게시글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            <br />
            문제가 계속되면 잠시 뒤에 다시 방문해주세요.
          </p>
          {error.digest && <p className="text-xs text-gray-400">오류 코드: {error.digest}</p>}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </section>
  );
}
