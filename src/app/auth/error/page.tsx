"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const errorMessages = {
  authentication_required: {
    title: "로그인이 필요합니다",
    description: "이 페이지에 접근하려면 로그인이 필요합니다.",
  },
  insufficient_permissions: {
    title: "접근 권한이 없습니다",
    description: "이 페이지에 접근할 권한이 없습니다.",
  },
  session_expired: {
    title: "세션이 만료되었습니다",
    description: "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
  },
  token_refresh_failed: {
    title: "인증 토큰 갱신 실패",
    description: "인증 토큰을 갱신하는데 실패했습니다. 다시 로그인해주세요.",
  },
  default: {
    title: "인증 오류",
    description: "인증 과정에서 오류가 발생했습니다.",
  },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") as keyof typeof errorMessages;
  // const callbackUrl = searchParams.get("callbackUrl") || "/";

  const errorInfo = errorMessages[error] || errorMessages.default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">{errorInfo.title}</h3>
          <p className="mt-2 text-sm text-gray-500">{errorInfo.description}</p>
        </div>

        <div className="mt-6 flex flex-col space-y-3">
          <Link
            href="/"
            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            홈으로 돌아가기
          </Link>
        </div>

        {error && <div className="mt-4 text-center text-xs text-gray-400">Error Code: {error}</div>}
      </div>
    </div>
  );
}
