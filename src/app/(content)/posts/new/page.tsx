"use client";

/**
 * 게시글 작성 페이지
 * 
 * 공통 PostForm 컴포넌트를 사용하여 게시글 작성 기능을 구현합니다.
 */

import PostForm, { type PostFormData } from "@/components/features/posts/PostForm";
import { useCreatePost } from "@/hooks/queries/usePostQueries";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();
  const createPostMutation = useCreatePost();

  const handleSubmit = async (data: PostFormData) => {
    const result = await createPostMutation.mutateAsync({
      title: data.title,
      content: data.content,
      tags: data.tags,
      commitMessage: data.commitMessage,
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