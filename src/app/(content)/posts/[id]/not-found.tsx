import Link from "next/link";

/**
 * 게시글을 찾을 수 없을 때 표시되는 페이지
 *
 * Next.js의 not-found.tsx는 notFound() 함수가 호출되거나
 * 404 상태가 발생했을 때 자동으로 표시됩니다.
 */
export default function NotFound() {
  return (
    <section className="mx-16 my-16">
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-gray-300">404</h1>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">게시글을 찾을 수 없습니다</h2>
          <p className="mb-8 max-w-md text-gray-600">
            요청하신 게시글이 존재하지 않거나 삭제되었습니다.
            <br />
            다른 게시글을 확인해보세요.
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/posts"
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
          >
            게시글 목록 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
