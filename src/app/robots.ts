import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/api/", "/admin/", "/(auth)/", "/mypage/"],
        crawlDelay: 10, // 10초 간격으로 크롤 속도 제한
      },
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/", "/admin/", "/mypage/"],
        crawlDelay: 10,
      },
    ],
    sitemap: "https://gamzatech.site/sitemap.xml",
  };
}
