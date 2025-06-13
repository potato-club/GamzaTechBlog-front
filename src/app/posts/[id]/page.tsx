import PostCommentsSection from "@/components/features/posts/PostCommentsSection";
import TagBadge from '@/components/ui/TagBadge'; // TagBadge 컴포넌트 임포트
import { postService } from "@/services/postService";
import { CommentData, PostDetailData } from "@/types/comment";
import Image from 'next/image';
import { notFound } from 'next/navigation';

// UiComment 인터페이스는 PostCommentsSection.tsx로 이동 또는 공유 타입으로 관리

interface PostPageProps {
  params: { id: string; };
}

export default async function PostPage({ params }: PostPageProps) {
  const postId = params.id ? Number(params.id) : null;

  if (!postId) {
    notFound();
  }

  let post: PostDetailData | null = null;
  let fetchError: string | null = null;

  try {
    post = await postService.getPostById(postId);
  } catch (err) {
    console.error("Failed to fetch post:", err);
    fetchError = err instanceof Error ? err.message : "게시물을 불러오는데 실패했습니다.";
    // 프로덕션에서는 error.tsx 등을 통해 사용자 친화적 에러 페이지를 보여주는 것이 좋습니다.
  }

  if (fetchError) {
    // return <div>Error: {fetchError}</div>; // 또는 throw new Error(fetchError) 후 error.tsx로 처리
    // 임시로 간단한 에러 메시지 표시
    return <div className="container mx-auto py-10">게시물을 불러오는 중 오류가 발생했습니다: {fetchError}</div>;
  }

  if (!post) {
    notFound();
  }

  // API에서 가져온 댓글을 UI용 댓글 형식으로 변환 (서버에서 수행)
  const initialUiComments: CommentData[] = post.comments.map(comment => ({
    commentId: comment.commentId,
    writer: comment.writer,
    content: comment.content,
    createdAt: new Date(comment.createdAt).toLocaleDateString('ko-KR'), // 날짜 형식 'YYYY. MM. DD.'
    replies: comment.replies || [],
  }));

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
          </div>

          <ul className="flex gap-2 text-[14px]" role="list">
            {post.tags.map((tag, index) => (
              <li key={index}>
                <TagBadge tag={tag} />
              </li>
            ))}
          </ul>
        </header>

        <div className="my-6 text-[17px] text-[#474F5D] leading-relaxed">
          {post.content}
        </div>
      </article>

      {/* 댓글 섹션을 클라이언트 컴포넌트로 분리 */}
      <PostCommentsSection
        postId={postId}
        initialComments={initialUiComments}
        totalCommentsCount={post.comments.length}
      />
    </main>
  );
}