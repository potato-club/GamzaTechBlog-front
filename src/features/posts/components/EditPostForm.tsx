"use client";

/**
 * 게시글 수정 폼 (클라이언트 컴포넌트)
 *
 * Shell & Core 패턴에서 Core 역할을 담당합니다.
 * - 사용자 인터랙션 처리
 * - 폼 상태 관리
 * - 수정 mutation 실행
 */

import { PostForm, useUpdatePost, type PostFormData } from "@/features/posts";
import type { PostDetailResponse } from "@/generated/api";
import { useAuth } from "@/hooks/useAuth";
import { canEditPost } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface EditPostFormProps {
  post: PostDetailResponse;
  postId: number;
}

export function EditPostForm({ post, postId }: EditPostFormProps) {
  const router = useRouter();
  const { userProfile, isLoggedIn, isLoading } = useAuth();

  const updatePostMutation = useUpdatePost({
    onSuccess: (result) => {
      if (result.success) {
        router.push(`/posts/${postId}`);
      } else {
        alert(result.error);
      }
    },
    onError: (error) => {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정 중 오류가 발생했습니다.");
    },
  });

  const handleSubmit = async (data: PostFormData) => {
    await updatePostMutation.mutateAsync({
      postId,
      postData: {
        title: data.title,
        content: data.content,
        tags: data.tags,
      },
    });
  };

  // 로딩 중 UI (인증 정보 로딩 중)
  if (isLoading) {
    return (
      <div className="mt-32 flex min-h-[400px] items-center justify-center">
        <div className="text-lg text-gray-600">사용자 정보를 확인하는 중...</div>
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

  // 게시글 수정 권한 체크
  if (!canEditPost(userProfile, post.writer || "")) {
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
