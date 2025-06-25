"use client";

/**
 * 게시글 수정 페이지
 * 
 * 공통 PostForm 컴포넌트를 사용하여 게시글 수정 기능을 구현합니다.
 */

import PostForm, { type PostFormData } from "@/components/features/posts/PostForm";
import { usePost, useUpdatePost } from "@/hooks/queries/usePostQueries";
import { useRouter } from "next/navigation";

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const postId = parseInt(params.id);

  // 기존 게시글 데이터 조회
  const { data: post, isLoading: isLoadingPost, error } = usePost(postId);

  console.log("edit post data", post);

  const updatePostMutation = useUpdatePost();

  const handleSubmit = async (data: PostFormData) => {
    await updatePostMutation.mutateAsync({
      postId,
      data: {
        title: data.title,
        content: data.content,
        tags: data.tags,
        commitMessage: data.commitMessage,
      }
    });

    // 성공 시 게시글 상세 페이지로 이동
    router.push(`/posts/${postId}`);
  };

  // 로딩 중 UI
  if (isLoadingPost) {
    return (
      <div className="mt-32 flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">게시글을 불러오는 중...</div>
      </div>
    );
  }

  // 에러 처리
  if (error || !post) {
    return (
      <div className="mt-32 flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="text-lg text-red-600">게시글을 불러올 수 없습니다.</div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <PostForm
      mode="edit"
      initialData={{
        title: post.title,
        content: post.content,
        tags: post.tags || []
      }}
      onSubmit={handleSubmit}
      isLoading={updatePostMutation.isPending}
    />
  );
}
