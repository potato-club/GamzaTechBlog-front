import { postService } from "@/services/postService";
import { Metadata } from "next";
import MainPageContent from "../components/MainPageContent";
import { DynamicWelcomeModal } from "@/components/dynamic/DynamicComponents";

/**
 * 메인 페이지 동적 메타데이터 생성
 *
 * 태그가 선택된 경우 해당 태그에 맞는 메타데이터를 생성합니다.
 * 예: #react 태그 선택시 "React 태그 게시글 | 감자 기술 블로그"
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}): Promise<Metadata> {
  const { tag, page } = await searchParams;

  if (tag) {
    return {
      title: `#${tag} 태그 게시글${page ? ` (${page}페이지)` : ""} | 감자 기술 블로그`,
      description: `${tag} 태그와 관련된 기술 블로그 게시글들을 확인해보세요. 감자 동아리 구성원들이 직접 작성한 실무 경험과 학습 내용을 공유합니다.`,
      keywords: `${tag}, 개발, 기술블로그, 프로그래밍, 감자, 한세대학교`,
      openGraph: {
        title: `#${tag} 태그 게시글 | 감자 기술 블로그`,
        description: `${tag} 관련 기술 게시글 모음`,
        type: "website",
      },
    };
  }

  if (page && page !== "1") {
    return {
      title: `게시글 목록 (${page}페이지) | 감자 기술 블로그`,
      description: `감자 기술 블로그의 모든 게시글을 확인해보세요. ${page}페이지`,
      keywords: "개발, 기술블로그, 프로그래밍, 감자, 한세대학교",
    };
  }

  // 기본 메타데이터 (기존 layout.tsx에서 가져옴)
  return {
    title: "감자 기술 블로그",
    description:
      "안녕하세요. 감자 기술 블로그입니다. 한세대학교 웹·앱 개발 동아리 감자 구성원들의 지식 공유 공간입니다.",
    keywords: "개발, 기술블로그, 프로그래밍, 감자, 한세대학교, 웹개발, 앱개발",
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  // 서버에서 초기 데이터 페칭 (SEO 및 초기 로딩 최적화)
  const { tag, page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  let initialPosts = null;
  let initialPopularPosts = null;
  let initialTags = null;

  try {
    // 병렬로 초기 데이터 페칭
    const [postsResult, popularResult, tagsResult] = await Promise.allSettled([
      // 메인 게시글 목록
      tag
        ? postService.getPostsByTag(
            tag,
            { page: page - 1, size: 10, sort: ["createdAt,desc"] },
            {
              revalidate: 300, // 5분 캐싱
              tags: [`posts-tag-${tag}`],
            }
          )
        : postService.getPosts(
            { page: page - 1, size: 10, sort: ["createdAt,desc"] },
            {
              revalidate: 300, // 5분 캐싱
              tags: ["posts-list"],
            }
          ),

      // 인기 게시글
      postService.getPopularPosts({
        revalidate: 86400, // 24시간 캐싱
        tags: ["popular-posts"],
      }),

      // 태그 목록
      postService.getTags({
        revalidate: 86400, // 24시간 캐싱
        tags: ["tags"],
      }),
    ]);

    if (postsResult.status === "fulfilled") initialPosts = postsResult.value;
    if (popularResult.status === "fulfilled") initialPopularPosts = popularResult.value;
    if (tagsResult.status === "fulfilled") initialTags = tagsResult.value;
  } catch (error) {
    console.error("서버에서 초기 데이터 페칭 실패:", error);
    // 에러가 발생해도 클라이언트에서 로딩하도록 fallback
  }

  return (
    <>
      <DynamicWelcomeModal />
      <MainPageContent
        initialPosts={initialPosts}
        initialPopularPosts={initialPopularPosts}
        initialTags={initialTags}
        searchParams={{ tag, page: pageParam }}
      />
    </>
  );
}
