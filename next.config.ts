import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    // 프로덕션 빌드 시 특정 console 로그만 제거
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"], // error와 warn은 남기고 나머지(log, info, debug 등) 제거
          }
        : false,
  },
  images: {
    unoptimized: true, // Disable global image optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gamzatech-bucket.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
    // 최신 이미지 포맷 지원 (WebP, AVIF)
    formats: ["image/webp", "image/avif"],
    // 다양한 디바이스 크기 지원 (Vercel 변환 최소화를 위해 축소)
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [24, 48, 96, 176, 256],
    // 캐시 최적화
    minimumCacheTTL: 31536000, // 1년
  },

  /* 실험적 기능들 */
  experimental: {
    // 특정 패키지의 import 최적화
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react", "@tanstack/react-query"],
  },

  /* 서버 컴포넌트 외부 패키지 설정 */
  serverExternalPackages: ["@toast-ui/editor"],

  /* 컴파일러 최적화 */
  compiler: {
    // 프로덕션에서 console.log 제거
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"], // error와 warn은 유지
          }
        : false,
  },

  /* 번들 분석 및 최적화 */
  webpack: (config, { dev, isServer }) => {
    // 프로덕션 빌드에서 번들 크기 최적화
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            // 벤더 라이브러리들을 별도 청크로 분리
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: 10,
            },
            // React 관련 라이브러리들을 별도 청크로 분리
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: "react",
              chunks: "all",
              priority: 20,
            },
            // UI 라이브러리들을 별도 청크로 분리
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
              name: "ui",
              chunks: "all",
              priority: 15,
            },
          },
        },
      };
    }

    return config;
  },

  /* 성능 최적화 */
  poweredByHeader: false, // X-Powered-By 헤더 제거
  compress: true, // gzip 압축 활성화

  /* 개발 환경 설정 */
  ...(process.env.NODE_ENV === "development" && {
    // 개발 환경에서만 적용되는 설정들
    typescript: {
      // 개발 중에는 타입 에러가 있어도 빌드 계속 진행
      ignoreBuildErrors: false,
    },
    eslint: {
      // 개발 중에는 ESLint 에러가 있어도 빌드 계속 진행
      ignoreDuringBuilds: false,
    },
  }),
};

export default nextConfig;
