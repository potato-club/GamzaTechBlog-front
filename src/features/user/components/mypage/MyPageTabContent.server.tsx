import EmptyState from "@/components/shared/EmptyState";
import { CommentList } from "@/features/comments";
import { PostCard } from "@/features/posts";
import { createCommentServiceServer } from "@/features/comments/services/commentService.server";
import { createPostServiceServer } from "@/features/posts/services/postService.server";
import { getPublicUser } from "@/features/user/services/userService.server";
import MyPagePagination from "./MyPagePagination.client";
import MyPageTabMenu from "./MyPageTabMenu.client";
import type {
  CommentResponse,
  LikeResponse,
  Pageable,
  PagedResponseCommentListResponse,
  PagedResponseLikeResponse,
  PagedResponsePostListResponse,
  PostListResponse,
} from "@/generated/api/models";
import { VALID_TABS, type TabType } from "@/types/mypage";

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_SORT = ["createdAt,desc"];

interface MyPageTabContentServerProps {
  mode?: "mypage" | "public";
  username?: string;
  searchParams?:
    | Record<string, string | string[] | undefined>
    | URLSearchParams
    | Promise<Record<string, string | string[] | undefined> | URLSearchParams>;
}

const resolveParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

const getSearchParam = (
  source: Record<string, string | string[] | undefined> | URLSearchParams | undefined,
  key: string
) => {
  if (!source) {
    return undefined;
  }

  if (typeof (source as URLSearchParams).get === "function") {
    return (source as URLSearchParams).get(key) ?? undefined;
  }

  return resolveParam(source[key]);
};

const resolveTab = (value?: string | string[]): TabType => {
  const tab = resolveParam(value);
  if (tab && VALID_TABS.includes(tab as TabType)) {
    return tab as TabType;
  }
  return "posts";
};

const resolvePage = (value?: string | string[]) => {
  const pageValue = resolveParam(value);
  const page = Number(pageValue);
  return Number.isFinite(page) && page > 0 ? page : 1;
};

export default async function MyPageTabContentServer({
  mode = "mypage",
  username,
  searchParams,
}: MyPageTabContentServerProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const isOwner = mode === "mypage";
  const currentTab = isOwner
    ? resolveTab(getSearchParam(resolvedSearchParams, "tab"))
    : "posts";
  const currentPage = resolvePage(getSearchParam(resolvedSearchParams, "page"));
  const pageParams: Pageable = {
    page: currentPage - 1,
    size: DEFAULT_PAGE_SIZE,
    sort: DEFAULT_SORT,
  };

  let postsData: PagedResponsePostListResponse | null = null;
  let commentsData: PagedResponseCommentListResponse | null = null;
  let likesData: PagedResponseLikeResponse | null = null;
  let errorMessage: string | null = null;

  try {
    if (!isOwner) {
      if (!username) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }

      const publicProfile = await getPublicUser(username, pageParams);
      postsData = publicProfile?.posts ?? null;
    } else {
      const postService = createPostServiceServer();
      const commentService = createCommentServiceServer();

      if (currentTab === "posts") {
        postsData = await postService.getUserPosts(pageParams);
      } else if (currentTab === "comments") {
        commentsData = await commentService.getUserComments(pageParams);
      } else {
        likesData = await postService.getUserLikes(pageParams);
      }
    }
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
  }

  const totalPages =
    postsData?.totalPages ?? commentsData?.totalPages ?? likesData?.totalPages ?? 0;

  const renderContent = () => {
    if (errorMessage) {
      return (
        <div className="mt-8 text-center text-red-600">
          <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
          <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
        </div>
      );
    }

    if (currentTab === "posts") {
      const posts = (postsData?.content || []) as PostListResponse[];
      if (posts.length === 0) {
        return (
          <EmptyState
            icon={
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
            title="작성한 게시글이 없습니다"
            description="첫 번째 게시글을 작성해보세요!"
          />
        );
      }

      return (
        <div className="mt-4 flex flex-col gap-4 md:mt-8 md:gap-8">
          {posts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))}
          <MyPagePagination currentTab={currentTab} totalPages={totalPages} className="mt-8 md:mt-12" />
        </div>
      );
    }

    if (currentTab === "comments") {
      const comments = (commentsData?.content || []) as CommentResponse[];
      if (comments.length === 0) {
        return (
          <EmptyState
            icon={
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            }
            title="작성한 댓글이 없습니다"
            description="다른 사용자의 게시글에 댓글을 달아보세요!"
          />
        );
      }

      return (
        <>
          <CommentList comments={comments} variant="my" className="mt-4 md:mt-6" />
          <MyPagePagination currentTab={currentTab} totalPages={totalPages} className="mt-8 md:mt-12" />
        </>
      );
    }

    const likes = (likesData?.content || []) as LikeResponse[];
    if (likes.length === 0) {
      return (
        <EmptyState
          icon={
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          }
          title="좋아요한 게시글이 없습니다"
          description="마음에 드는 게시글에 좋아요를 눌러보세요!"
        />
      );
    }

    return (
      <div className="mt-4 flex flex-col gap-4 md:mt-8 md:gap-8">
        {likes.map((like) => (
          <PostCard key={like.likeId ?? like.postId} post={like as PostListResponse} />
        ))}
        <MyPagePagination currentTab={currentTab} totalPages={totalPages} className="mt-8 md:mt-12" />
      </div>
    );
  };

  return (
    <section className="flex-1" aria-label={isOwner ? "마이페이지 콘텐츠" : "프로필 콘텐츠"}>
      {isOwner ? <MyPageTabMenu /> : null}
      <div role="tabpanel" aria-labelledby={`${currentTab}-tab`} className="mt-4 md:mt-6">
        <div className="px-0 md:px-10">
          <div className="mx-auto w-full md:min-w-[700px]">{renderContent()}</div>
        </div>
      </div>
    </section>
  );
}
