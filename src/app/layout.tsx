import BlogHeader from "@/components/shared/layout/BlogHeader";
import type { Metadata } from "next";
import Link from "next/link";
import SessionSynchronizer from "../components/shared/interactive/SessionSynchronizer";
import Footer from "../components/shared/layout/Footer";
import AuthProvider from "../providers/AuthProvider";
import QueryProvider from "../providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "감자 기술 블로그",
  description: "안녕하세요. 감자 기술 블로그입니다.",
  keywords: "개발, 기술블로그, 프로그래밍, 감자",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
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
      <body className="bg-white">
        {" "}
        {/* 기존 max-w, mx-auto, px 제거 */}
        {/* Skip to main content for accessibility */}
        <Link
          href="#main-content"
          className="sr-only z-50 rounded bg-[#20242B] px-4 py-2 text-white transition-all focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:ring-2 focus:ring-white"
          scroll={false}
        >
          메인 콘텐츠로 이동
        </Link>
        {/* 콘텐츠를 중앙 정렬하고 최대 너비를 제한하는 wrapper div 추가 */}
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="flex min-h-screen flex-col">
            <AuthProvider>
              <QueryProvider>
                <SessionSynchronizer />
                <BlogHeader />
                <div
                  id="main-content"
                  className="flex-grow" // flex-grow 추가하여 푸터가 항상 하단에 위치하도록 도움
                >
                  {children}
                </div>
              </QueryProvider>
            </AuthProvider>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
