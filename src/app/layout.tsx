import type { Metadata } from "next";
import Link from "next/link";
import BlogHeader from "../components/BlogHeader";
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
      <body className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 bg-white">
        {/* Skip to main content for accessibility */}
        <Link
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#20242B] text-white px-4 py-2 rounded z-50 transition-all focus:ring-2 focus:ring-white"
          scroll={false}
        >
          메인 콘텐츠로 이동
        </Link>

        <div className="min-h-screen flex flex-col">
          <BlogHeader />

          <div
            id="main-content"
            className="flex-1 mt-16"
          >
            {children}
          </div>

          <footer className="mt-auto py-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>&copy; Gamza Tech Blog. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}