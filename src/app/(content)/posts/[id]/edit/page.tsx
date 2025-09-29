"use client";

/**
 * 게시글 수정 페이지
 *
 * 공통 PostForm 컴포넌트를 사용하여 게시글 수정 기능을 구현합니다.
 */

import { PostForm, usePost, useUpdatePost, type PostFormData } from "@/features/posts";
// Zustand import 제거됨 - import { useAuth } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { canEditPost } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { use } from "react";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();

  // Next.js 15+ params는 Promise이므로 React.use()로 unwrap
  const resolvedParams = use(params);
  const postId = parseInt(resolvedParams.id);

  const { userProfile, isLoggedIn, isLoading } = useAuth();

  // 기존 게시글 데이터 조회
  const { data: post, isLoading: isLoadingPost, error } = usePost(postId);

  const updatePostMutation = useUpdatePost();

  const handleSubmit = async (data: PostFormData) => {
    await updatePostMutation.mutateAsync({
      postId,
      data: {
        title: data.title,
        content: data.content,
        tags: data.tags,
        commitMessage: data.commitMessage,
      },
    });

    // 성공 시 게시글 상세 페이지로 이동
    router.push(`/posts/${postId}`);
  };

  // 로딩 중 UI (인증 정보 또는 게시글 로딩 중)
  if (isLoading || isLoadingPost) {
    return (
      <div className="mt-32 flex min-h-[400px] items-center justify-center">
        <div className="text-lg text-gray-600">
          {isLoading ? "사용자 정보를 확인하는 중..." : "게시글을 불러오는 중..."}
        </div>
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!isLoggedIn || !userProfile) {
    return (
      <div className="mt-32 flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="text-lg text-red-600">로그인이 필요합니다.</div>
        <button
          onClick={() => router.push("/login")}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          로그인하기
        </button>
      </div>
    );
  }


  // 게시글 로딩 에러 또는 존재하지 않는 경우
  if (error || !post) {
    return (
      <div className="mt-32 flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="text-lg text-red-600">게시글을 불러올 수 없습니다.</div>
        <button
          onClick={() => router.back()}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  // 게시글 수정 권한 체크
  if (!canEditPost(userProfile, post.writer)) {
    return (
      <div className="mt-32 flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="text-lg text-red-600">이 게시글을 수정할 권한이 없습니다.</div>
        <div className="text-sm text-gray-600">본인이 작성한 게시글만 수정할 수 있습니다.</div>
        <button
          onClick={() => router.back()}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
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
        title: post.title || "",
        content: post.content || "",
        tags: post.tags || [],
      }}
      onSubmitAction={handleSubmit}
      isLoading={updatePostMutation.isPending}
    />
  );
}
