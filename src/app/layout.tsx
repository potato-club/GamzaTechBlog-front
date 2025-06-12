import type { Metadata } from "next";
import Link from "next/link";
import BlogHeader from "../components/BlogHeader";
import QueryProvider from "../providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "감자 기술 블로그",
  description: "안녕하세요. 감자 기술 블로그입니다.",
  keywords: "개발, 기술블로그, 프로그래밍, 감자",
  openGraph: {
    title: "감자 기술 블로그",
    description: "안녕하세요. 감자 기술 블로그입니다.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/* body 태그는 전체 너비를 차지하도록 기본 스타일 유지 */}
      <body className="bg-white"> {/* 기존 max-w, mx-auto, px 제거 */}
        {/* Skip to main content for accessibility */}
        <Link
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#20242B] text-white px-4 py-2 rounded z-50 transition-all focus:ring-2 focus:ring-white"
          scroll={false}
        >
          메인 콘텐츠로 이동
        </Link>

        {/* 콘텐츠를 중앙 정렬하고 최대 너비를 제한하는 wrapper div 추가 */}
        <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="min-h-screen flex flex-col">
            <QueryProvider>
              <BlogHeader />
              <div // div 대신 main 시맨틱 태그 사용 권장
                id="main-content"
                className="mt-16 flex-grow" // flex-grow 추가하여 푸터가 항상 하단에 위치하도록 도움
              >
                {children}
              </div>
            </QueryProvider>

            <footer className="mt-auto py-8 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>&copy; Gamza Tech Blog. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}