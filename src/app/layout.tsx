import type { Metadata, Viewport } from "next";
import Link from "next/link";

import BlogHeader from "@/components/shared/layout/BlogHeader";
import Footer from "@/components/shared/layout/Footer";
import { Toaster } from "@/components/ui";
import Providers from "@/providers/Providers";
import { ChatBot } from "../features/chatbot";
import { pretendard } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "감자 기술 블로그",
    template: "%s | 감자 기술 블로그",
  },
  description: "개발과 기술에 대한 다양한 인사이트를 공유하는 감자 기술 블로그입니다.",
  keywords: ["개발", "기술블로그", "프로그래밍", "웹개발", "소프트웨어", "감자"],
  authors: [{ name: "감자 기술 블로그" }],
  creator: "감자 기술 블로그",
  publisher: "감자 기술 블로그",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "감자 기술 블로그",
    title: "감자 기술 블로그",
    description: "개발과 기술에 대한 다양한 인사이트를 공유하는 감자 기술 블로그입니다.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "감자 기술 블로그 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "감자 기술 블로그",
    description: "개발과 기술에 대한 다양한 인사이트를 공유하는 감자 기술 블로그입니다.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#20242B" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className={`bg-white antialiased ${pretendard.className}`}>
        <Providers>
          <Link
            href="#main-content"
            className="sr-only z-50 rounded bg-[#20242B] px-4 py-2 text-white transition-all focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:ring-2 focus:ring-white focus:outline-none"
            aria-label="메인 콘텐츠로 바로 이동"
          >
            메인 콘텐츠로 이동
          </Link>

          <div className="layout-stable mx-auto w-full max-w-[1100px] px-6 lg:px-0">
            <div className="flex min-h-screen flex-col">
              <BlogHeader />
              <main id="main-content" className="flex-grow">
                {children}
              </main>
              <Toaster />
              <Footer />
            </div>
          </div>

          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}
