import { API_CONFIG } from "@/config/api";
import { API_PATHS } from "@/constants/apiPaths";
import { PostDetailResponse } from "@/generated/api/models";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PostPageClient from "../../../../components/features/posts/PostPageClient";

/**
 * 동적 메타데이터 생성 함수
 *
 * 이 함수는 각 게시글마다 고유한 메타데이터를 생성합니다.
 * - 검색엔진 최적화 (SEO)
 * - 소셜미디어 공유시 미리보기 개선
 * - 카카오톡, 페이스북 등에서 링크 공유시 예쁜 카드 형태로 표시
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: postId } = await params;

  try {
    // 메타데이터 생성을 위한 서버 캐싱 적용
    const endpoint = API_PATHS.posts.byId(Number(postId));
    const response = await fetch(API_CONFIG.BASE_URL + endpoint, {
      next: {
        revalidate: 3600, // 1시간 캐싱 (게시글은 자주 안바뀜)
        tags: [`post-${postId}`, "posts"],
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          title: "게시글을 찾을 수 없습니다 | 감자 기술 블로그",
          description: "요청하신 게시글이 존재하지 않습니다.",
        };
      }
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const data = await response.json();
    const post = data.data as PostDetailResponse;

    if (!post) {
      return {
        title: "게시글을 찾을 수 없습니다 | 감자 기술 블로그",
        description: "요청하신 게시글이 존재하지 않습니다.",
      };
    }

    // 게시글 내용에서 첫 160자를 설명으로 사용 (소셜미디어 최적 길이)
    const description = post.content
      ? post.content.replace(/[#*`]/g, "").substring(0, 160) + "..."
      : "감자 기술 블로그의 게시글입니다.";

    return {
      title: `${post.title} | 감자 기술 블로그`,
      description,
      keywords: post.tags?.join(", ") || "개발, 기술블로그, 프로그래밍",

      // OpenGraph: 페이스북, 카카오톡 등에서 사용
      openGraph: {
        title: post.title,
        description,
        type: "article",
        publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
        authors: [post.writer || "익명"],
        tags: post.tags,
        // PostDetailResponse에는 thumbnailImageUrl이 없으므로 기본 이미지 사용
        images: [
          {
            url: "/logo2.svg", // 기본 로고 이미지 사용
            width: 1200,
            height: 630,
            alt: post.title || "감자 기술 블로그",
          },
        ],
      },

      // Twitter 카드: 트위터에서 사용
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: ["/logo2.svg"], // 기본 로고 이미지 사용
      },

      // 추가 SEO 설정
      alternates: {
        canonical: `/posts/${postId}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "게시글 | 감자 기술 블로그",
      description: "감자 기술 블로그의 게시글입니다.",
    };
  }
}

/**
 * 게시글 상세 페이지 (서버 컴포넌트)
 *
 * 서버 컴포넌트로 변경한 이유:
 * 1. 메타데이터 생성을 위해 필요
 * 2. 초기 로딩 성능 개선
 * 3. SEO 최적화
 */
export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);

  // URL 파라미터 유효성 검사
  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  // 서버 컴포넌트에서는 클라이언트 컴포넌트로 로직을 위임
  return <PostPageClient postId={postId} />;
}
