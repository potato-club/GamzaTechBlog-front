import type { Metadata } from "next";
import BlogHeader from "../components/BlogHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "감자 기술 블로그",
  description: "안녕하세요. 감자 기술 블로그입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="mx-[80px]">
        <BlogHeader />
        {children}
      </body>
    </html>
  );
}
