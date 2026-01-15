import {
  DynamicMarkdownViewer,
  DynamicPostCommentsSection,
} from "@/components/dynamic/DynamicComponents";
import PostHeader from "@/features/posts/components/PostHeader";
import PostStats from "@/features/posts/components/PostStats";
import { createUserServiceServer } from "@/features/user/services/userService.server";
import {
  getGetPostDetailQueryOptions,
  getIsPostLikedQueryOptions,
  getPostDetail,
} from "@/generated/orval/api";
import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { isPostOwner } from "../../../../lib/auth";

/**
 * 게시글 데이터 캐싱 함수 (메타데이터용)
 *
 * React의 cache 함수를 사용하여 동일한 postId에 대한 중복 요청을 방지합니다.
 * generateMetadata와 PostPage 컴포넌트에서 동일한 데이터를 사용할 때 최적화됩니다.
 */
const getCachedPost = cache(async (postId: number) => {
  try {
    const response = await getPostDetail(postId);
    return response.data;
  } catch {
    return null;
  }
});

/**
 * 동적 메타데이터 생성 함수
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: postId } = await params;

  try {
    const post = await getCachedPost(Number(postId));

    if (!post) {
      return {
        title: "게시글을 찾을 수 없습니다 | 감자 기술 블로그",
        description: "요청하신 게시글이 존재하지 않습니다.",
      };
    }

    const description = post.content
      ? post.content.replace(/[#*`]/g, "").substring(0, 160) + "..."
      : "감자 기술 블로그의 게시글입니다.";

    return {
      title: `${post.title} | 감자 기술 블로그`,
      description,
      keywords: post.tags?.join(", ") || "개발, 기술블로그, 프로그래밍",
      openGraph: {
        title: post.title,
        description,
        type: "article",
        publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
        authors: [post.writer || "익명"],
        tags: post.tags,
        images: [
          {
            url: "/logo2.svg",
            width: 1200,
            height: 630,
            alt: post.title || "감자 기술 블로그",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: ["/logo2.svg"],
      },
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
 * 게시글 상세 페이지 (서버 컴포넌트 + RQ Hydration)
 *
 * 서버에서 prefetchQuery로 데이터를 가져오고,
 * HydrationBoundary로 클라이언트에 전달합니다.
 */
export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  const queryClient = getQueryClient();

  try {
    // 게시글 상세 데이터 prefetch
    await queryClient.prefetchQuery(getGetPostDetailQueryOptions(postId));

    // 게시글 데이터 가져오기 (렌더링용)
    const postData = queryClient.getQueryData(getGetPostDetailQueryOptions(postId).queryKey) as
      | Awaited<ReturnType<typeof getPostDetail>>
      | undefined;

    const post = postData?.data;

    if (!post) {
      notFound();
    }

    // 현재 로그인한 사용자 확인 (작성자 여부)
    let isPostOwnerFlag = false;
    let isLoggedIn = false;

    try {
      const userService = createUserServiceServer();
      const profileData = await userService.getProfile({ cache: "no-store" });

      if (profileData) {
        isLoggedIn = true;
        isPostOwnerFlag = isPostOwner(profileData, post.writer || "");

        // 로그인된 사용자는 좋아요 상태도 prefetch
        await queryClient.prefetchQuery(getIsPostLikedQueryOptions(postId));
      }
    } catch (error) {
      console.warn(
        "User profile fetch failed:",
        error instanceof Error ? `${error.name}: ${error.message}` : String(error)
      );
    }

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="layout-stable mx-auto flex flex-col gap-6 md:gap-12">
          <article className="max-w-full border-b border-[#D5D9E3] px-4 py-6 md:px-8 md:py-8">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <PostHeader post={post as any} postId={postId} isCurrentUserAuthor={isPostOwnerFlag} />
            <DynamicMarkdownViewer content={post.content || ""} />
            {/* 게시글 좋아요 버튼 및 댓글 개수 - RQ 캐시에서 읽음 */}
            <PostStats postId={postId} isLoggedIn={isLoggedIn} />
          </article>

          <div className="px-4 md:px-8">
            {}
            <DynamicPostCommentsSection
              postId={postId}
              initialComments={(post.comments || []) as any}
            />
          </div>
        </div>
      </HydrationBoundary>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    notFound();
  }
}
