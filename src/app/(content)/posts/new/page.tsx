"use client";

/**
 * 게시글 작성 페이지
 *
 * 공통 PostForm 컴포넌트를 사용하여 게시글 작성 기능을 구현합니다.
 */

import type { PostFormData } from "@/features/posts";
import { PostForm, useCreatePost } from "@/features/posts";
import { useRouter } from "next/navigation";

// 동적 렌더링 강제 (사용자 인증이 필요한 페이지)
export const dynamic = "force-dynamic";

export default function CreatePostPage() {
  const router = useRouter();
  const createPostMutation = useCreatePost();

  const handleSubmit = async (data: PostFormData) => {
    const result = await createPostMutation.mutateAsync({
      title: data.title,
      content: data.content,
      tags: data.tags,
    });

    // 성공 시 게시글 상세 페이지로 이동
    router.push(`/posts/${result.postId}`);
  };

  return (
    <PostForm
      mode="create"
      onSubmitAction={handleSubmit}
      isLoading={createPostMutation.isPending}
    />
  );
}
