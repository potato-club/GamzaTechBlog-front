/**
 * 로그인 페이지 
 * 
 * 향후 확장을 위한 플레이스홀더 페이지입니다.
 * 현재는 GitHub OAuth를 통한 로그인만 지원하므로 리디렉션 처리합니다.
 */

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          로그인
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          또는{' '}
          <Link href="/(auth)/signup" className="font-medium text-blue-600 hover:text-blue-500">
            회원가입하기
          </Link>
        </p>
      </div>

      <div className="space-y-4">
        {/* GitHub OAuth 로그인 버튼 */}
        <button
          type="button"
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          GitHub으로 로그인
        </button>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-500"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
