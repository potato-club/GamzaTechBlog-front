import { EditPostForm } from "@/features/posts/components/EditPostForm";
import { createPostServiceServer } from "@/features/posts/services/postService.server";
import { notFound } from "next/navigation";

/**
 * 게시글 수정 페이지 (서버 컴포넌트)
 *
 * Shell & Core 패턴에서 Shell 역할을 담당합니다.
 * - 서버에서 게시글 데이터 조회
 * - 클라이언트 컴포넌트(EditPostForm)에 데이터 전달
 */

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function fetchPost(postId: number) {
  try {
    const postService = createPostServiceServer();
    return await postService.getPostById(postId, { cache: "no-store" });
  } catch {
    return null;
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const resolvedParams = await params;
  const postId = parseInt(resolvedParams.id);

  if (isNaN(postId)) {
    notFound();
  }

  const post = await fetchPost(postId);

  if (!post) {
    notFound();
  }

  return <EditPostForm post={post} postId={postId} />;
}
