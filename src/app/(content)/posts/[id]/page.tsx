import {
  DynamicMarkdownViewer,
  DynamicPostCommentsSection,
} from "@/components/dynamic/DynamicComponents";
import PostHeader from "@/features/posts/components/PostHeader";
import PostStats from "@/features/posts/components/PostStats";
import { createPostServiceServer } from "@/features/posts/services/postService.server";
import { isNotFoundError } from "@/lib/apiError";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

/**
 * 게시글 데이터 캐싱 함수
 *
 * React의 cache 함수를 사용하여 동일한 postId에 대한 중복 요청을 방지합니다.
 * generateMetadata와 PostPage 컴포넌트에서 동일한 데이터를 사용할 때 최적화됩니다.
 */
/**
 * ISR 설정
 *
 * revalidate: 라우트를 정적 생성하고 최대 24시간마다 시간 기반 재검증한다.
 *   실시간 최신화(글 수정·삭제·댓글 변경)는 revalidateTag("post-${id}")가 담당한다(cacheInvalidation).
 * generateStaticParams(빈 배열): 빌드 시 프리렌더하지 않고 첫 방문 시 온디맨드로 정적 생성 후
 *   캐시한다 — 게시글이 늘어도 빌드가 백엔드에 의존하지 않는다(dynamicParams 기본값 true).
 *   전체 프리렌더가 필요하면 여기서 ID 목록을 반환하도록 바꾸면 된다.
 */
export const revalidate = 86400;

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return [];
}

const getCachedPost = cache(async (postId: number) => {
  // 서버용 Post Service 사용
  const postService = createPostServiceServer();
  // ISR 적용: 86400초(24시간) 주기로 페이지를 재생성합니다.
  return await postService.getPostById(postId, { next: { revalidate: 86400 } });
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

    // 게시글이 없는 경우
    if (!post) {
      notFound();
    }

    // 개인화 조각(수정/삭제 버튼·좋아요 상태)은 렌더 이후 클라이언트에서 조회한다.
    // 서버 렌더에서 쿠키 의존 조회를 하면 이 라우트가 정적화(ISR)되지 못하기 때문이다.
    return (
      <div className="layout-stable mx-auto flex flex-col gap-6 md:gap-12">
        <article className="max-w-full border-b border-[#D5D9E3] px-4 py-6 md:px-8 md:py-8">
          <PostHeader post={post} postId={postId} />
          <DynamicMarkdownViewer content={post.content || ""} />
          {/* 게시글 좋아요 버튼 및 댓글 개수 노출 */}
          <PostStats
            postId={postId}
            initialLikesCount={post.likesCount || 0}
            commentsCount={post.comments?.length || 0}
          />
        </article>

        <div className="px-4 md:px-8">
          <DynamicPostCommentsSection postId={postId} initialComments={post.comments || []} />
        </div>
      </div>
    );
  } catch (error) {
    // 백엔드가 "글 없음(404)"이라고 확정한 경우만 not-found로 처리한다(캐시 가능한 확정 상태).
    if (isNotFoundError(error)) {
      notFound();
    }

    // 5xx·네트워크 등 일시적 오류는 재던진다 — ISR은 렌더 결과를 캐시하므로,
    // 에러를 not-found로 렌더하면 그게 캐시에 박혀(최대 revalidate 기간) 백엔드 복구 후에도
    // 계속 서빙된다(캐시 오염). 재던지면 Next가 캐시하지 않는다.
    //
    // 참고: 캐시에 없는 글을 장애 중 최초 요청하면 ISR 온디맨드 "생성"이 실패하는 것이라
    // error.tsx 바운더리를 거치지 않고 Next 기본 500이 나간다(프레임워크 제약).
    // error.tsx는 동적 렌더·클라이언트 네비게이션 경로의 오류를 담당한다.
    // 이미 캐시된 글은 장애 중에도 stale-while-revalidate로 정상 서빙된다.
    console.error("Error fetching post:", error);
    throw error;
  }
}
