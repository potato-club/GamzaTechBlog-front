"use client";

/**
 * 게시글 작성 페이지
 *
 * Server Actions를 통해 게시글을 생성하고,
 * 성공 시 서버/클라이언트 캐시를 모두 무효화하여
 * 즉각적인 UI 업데이트를 보장합니다.
 */

import type { PostFormData } from "@/features/posts";
import { PostForm, useCreatePost } from "@/features/posts";
import { useRouter } from "next/navigation";

// 동적 렌더링 강제 (사용자 인증이 필요한 페이지)
export const dynamic = "force-dynamic";

export default function CreatePostPage() {
  const router = useRouter();

  const createPostMutation = useCreatePost({
    onSuccess: (result) => {
      if (result.success) {
        router.push(`/posts/${result.data.postId}`);
      } else {
        alert(result.error);
      }
    },
    onError: (error) => {
      console.error("게시글 작성 실패:", error);
      alert("게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  const handleSubmit = async (data: PostFormData) => {
    await createPostMutation.mutateAsync({
      postData: {
        title: data.title,
        content: data.content,
        tags: data.tags,
      },
    });
  };

  return (
    <PostForm
      mode="create"
      onSubmitAction={handleSubmit}
      isLoading={createPostMutation.isPending}
    />
  );
}
