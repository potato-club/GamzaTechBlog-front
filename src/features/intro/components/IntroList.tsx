"use client";

import { useState } from "react";
import { useIntros } from "../hooks";
import IntroCard from "./IntroCard";

export default function IntroList() {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const {
    data: introData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useIntros({
    page,
    size: pageSize,
    sort: ["createdAt,desc"],
  });

  const intros = introData?.content || [];
  const totalPages = introData?.totalPages || 0;
  const hasNextPage = page + 1 < totalPages;
  const hasPrevPage = page > 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-[#FAFBFF] px-6 py-5">
            <div className="mt-1 flex items-center gap-2">
              <div className="mr-2 h-9 w-9 rounded-full bg-gray-300"></div>
              <div className="h-4 w-20 rounded bg-gray-300"></div>
            </div>
            <div className="mt-2 space-y-2">
              <div className="h-4 w-full rounded bg-gray-300"></div>
              <div className="h-4 w-3/4 rounded bg-gray-300"></div>
            </div>
            <div className="mt-2 h-3 w-32 rounded bg-gray-300"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">자기소개를 불러오는 중 오류가 발생했습니다.</p>
        <p className="mt-2 text-sm text-red-500">
          {error?.message || "알 수 없는 오류가 발생했습니다."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 로딩 인디케이터 */}
      {isFetching && !isLoading && (
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            업데이트 중...
          </div>
        </div>
      )}

      {/* 자기소개 목록 */}
      <div className="space-y-4">
        {intros.length > 0 ? (
          intros.map((intro) => <IntroCard key={intro.introId} intro={intro} />)
        ) : (
          <div className="rounded-xl bg-[#FAFBFF] p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h2m2-4h6a2 2 0 012 2v6a2 2 0 01-2 2h-6l-4 4V8a2 2 0 012-2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[#1C222E]">아직 자기소개가 없습니다</h3>
            <p className="text-[#464C58]">첫 번째 자기소개를 작성해보세요!</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={!hasPrevPage || isFetching}
            className="rounded-lg border border-[#E7EEFE] px-3 py-2 text-sm font-medium text-[#464C58] hover:bg-[#FAFBFF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            이전
          </button>

          <span className="px-3 py-2 text-sm text-[#464C58]">
            {page + 1} / {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={!hasNextPage || isFetching}
            className="rounded-lg border border-[#E7EEFE] px-3 py-2 text-sm font-medium text-[#464C58] hover:bg-[#FAFBFF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
