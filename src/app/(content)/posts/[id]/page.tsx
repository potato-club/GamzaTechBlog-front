import {
  DynamicMarkdownViewer,
  DynamicPostCommentsSection,
} from "@/components/dynamic/DynamicComponents";
import { PostHeader, PostStats, postService } from "@/features/posts";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { isPostAuthor } from "../../../../lib/auth";

/**
 * 게시글 데이터 캐싱 함수
 *
 * React의 cache 함수를 사용하여 동일한 postId에 대한 중복 요청을 방지합니다.
 * generateMetadata와 PostPage 컴포넌트에서 동일한 데이터를 사용할 때 최적화됩니다.
 */
const getCachedPost = cache(async (postId: number) => {
  // ISR 적용: 3600초(1시간) 주기로 페이지를 재생성합니다.
  return await postService.getPostById(postId, { next: { revalidate: 3600 } });
});

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
    // 캐싱된 함수를 사용하여 중복 요청 방지
    const post = await getCachedPost(Number(postId));

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
 * 서버 컴포넌트로 구현한 이유:
 * 1. SEO 최적화 - 게시글 내용이 서버에서 렌더링
 * 2. 초기 로딩 성능 개선 - 클라이언트 API 호출 없음
 * 3. 메타데이터와 데이터 소스 일관성
 * 4. 캐싱 최적화 - Next.js 서버 캐싱 활용
 */
export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);

  // URL 파라미터 유효성 검사
  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  try {
    // 캐싱된 함수를 사용하여 중복 요청 방지
    const post = await getCachedPost(postId);

    console.log("post", post);

    // 게시글이 없는 경우
    if (!post) {
      notFound();
    }

    // 현재 로그인한 사용자가 게시글 작성자인지 확인
    const isCurrentUserAuthor = post.githubId ? await isPostAuthor(post.githubId) : false;

    console.log(isCurrentUserAuthor);

    return (
      <div className="mx-16 my-16 max-w-full overflow-hidden">
        <article className="max-w-full border-b border-[#D5D9E3] py-8">
          <PostHeader post={post} postId={postId} isCurrentUserAuthor={isCurrentUserAuthor} />
          <DynamicMarkdownViewer content={post.content || ""} />
          {/* 게시글 좋아요 버튼 및 댓글 개수 노출 */}
          <PostStats
            postId={postId}
            initialLikesCount={post.likesCount || 0}
            commentsCount={post.comments?.length || 0}
          />
        </article>

        <DynamicPostCommentsSection postId={postId} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    notFound();
  }
}
