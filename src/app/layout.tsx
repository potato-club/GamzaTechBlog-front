import type { Metadata } from "next";
import { headers } from "next/headers";
import BlogHeader from "../components/BlogHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "감자 기술 블로그",
  description: "안녕하세요. 감자 기술 블로그입니다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const fullURL = headerList.get("referer") || "";

  let pathname = "";
  try {
    if (fullURL) {
      pathname = new URL(fullURL).pathname;
    }
  } catch (e) {
    pathname = "";
  }

  const hideHeaderPaths = ["/login"];
  const hideHeader = hideHeaderPaths.some((path) => pathname.startsWith(path));

  return (
    <html lang="en">
      <body className={`${!hideHeader && `mt-16`}  mx-[80px]`}>
        {!hideHeader && <BlogHeader />}
        {children}
      </body>
    </html>
  );
}
