import MarkdownViewer from "@/components/features/posts/MarkdownViewer";
import PostCommentsSection from "@/components/features/posts/PostCommentsSection";
import PostHeader from "@/components/features/posts/PostHeader";
import { postService } from "@/services/postService";
import { CommentData, PostDetailData } from "@/types/comment";
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
    writerProfileImageUrl: comment.writerProfileImageUrl,
    content: comment.content,
    createdAt: new Date(comment.createdAt).toLocaleDateString('ko-KR'),
    replies: comment.replies || [],
  }));

  // ❌ 이 부분들을 제거
  // const deletePostMutation = useDeletePost();
  // const handleDeletePost = () => { ... };
  // const headerDropdownItems = [...];

  return (
    <main className="mx-16 my-16">
      <article className="border-b border-[#D5D9E3] py-8">
        <PostHeader post={post} postId={postId} />

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