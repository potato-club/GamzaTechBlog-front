import MarkdownViewer from "@/components/features/posts/MarkdownViewer";
import { PostActionsDropdown } from "@/components/features/posts/PostActionsDropdown"; // 추가
import PostCommentsSection from "@/components/features/posts/PostCommentsSection";
import { Button } from "@/components/ui/button";
import TagBadge from '@/components/ui/TagBadge';
import { cn } from "@/lib/utils";
import { postService } from "@/services/postService";
import { CommentData, PostDetailData } from "@/types/comment";
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: Promise<{ id: string; }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  let post: PostDetailData | null = null;
  let fetchError: string | null = null;

  try {
    post = await postService.getPostById(postId);
    console.log("post data", post);
  } catch (err) {
    console.error("Failed to fetch post:", err);
    fetchError = err instanceof Error ? err.message : "게시물을 불러오는데 실패했습니다.";
  }

  if (fetchError) {
    return <div className="container mx-auto py-10">게시물을 불러오는 중 오류가 발생했습니다: {fetchError}</div>;
  }

  if (!post) {
    notFound();
  }

  const initialUiComments: CommentData[] = post.comments.map(comment => ({
    commentId: comment.commentId,
    writer: comment.writer,
    content: comment.content,
    createdAt: new Date(comment.createdAt).toLocaleDateString('ko-KR'),
    replies: comment.replies || [],
  }));

  // ❌ 이 부분들을 제거
  // const deletePostMutation = useDeletePost();
  // const handleDeletePost = () => { ... };
  // const headerDropdownItems = [...];

  const headerTriggerElement = (
    <Button
      variant="ghost"
      className={cn("relative h-8 w-8 rounded-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:cursor-pointer ml-auto")}
    >
      <Image
        src="/dot3.svg"
        alt="더보기"
        width={18}
        height={4}
      />
    </Button>
  );

  return (
    <main className="mx-16 my-16">
      <article className="border-b border-[#D5D9E3] py-8">
        <header>
          <h1 className="text-[32px] font-extrabold text-[#1C222E]">
            {post.title}
          </h1>

          <div className="flex h-12 items-center gap-4 text-[14px]">
            <div className="flex h-5 items-center border-r border-[#B5BBC7] pr-1.5">
              <Image
                src="/profileSVG.svg"
                alt={`${post.writer}의 프로필 이미지`}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="ml-2 font-medium text-[#798191]">
                {post.writer}
              </span>
            </div>
            <time dateTime={new Date(post.createdAt).toISOString().split("T")[0]} className="text-[#B5BBC7]">
              {new Date(post.createdAt).toLocaleDateString('ko-KR')}
            </time>

            <PostActionsDropdown
              postId={postId}
              triggerElement={headerTriggerElement}
            />
          </div>

          <ul className="flex gap-2 text-[14px]" role="list">
            {post.tags.map((tag, index) => (
              <li key={index}>
                <TagBadge tag={tag} />
              </li>
            ))}
          </ul>
        </header>

        <MarkdownViewer content={post.content} />
      </article>

      <PostCommentsSection
        postId={postId}
        initialComments={initialUiComments}
        totalCommentsCount={post.comments.length}
      />
    </main>
  );
}