"use client";

import { DropdownMenuList } from "@/components/common/DropdownMenuList";
import { useDeletePost, usePost } from "@/hooks/queries/usePostQueries";
import { useAuth } from "@/hooks/queries/useUserQueries";
import { DropdownActionItem } from "@/types/dropdown";
import { useRouter } from "next/navigation";

interface PostActionsDropdownProps {
  postId: number;
  triggerElement: React.ReactNode;
}

export function PostActionsDropdown({ postId, triggerElement }: PostActionsDropdownProps) {
  const router = useRouter();
  const deletePostMutation = useDeletePost();

  // 현재 사용자 정보 가져오기
  const { userProfile, isLoggedIn } = useAuth();

  // 게시글 정보 가져오기
  const { data: post } = usePost(postId);

  const handleDeletePost = () => {
    deletePostMutation.mutate(postId);
    router.push("/");
  };

  const handleEditPost = () => {
    // 로그인 상태 확인
    if (!isLoggedIn || !userProfile) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 게시글 정보 확인
    if (!post) {
      alert("게시글 정보를 불러올 수 없습니다.");
      return;
    }

    // 작성자 확인 (현재 사용자의 닉네임과 게시글 작성자 비교)
    const isAuthor = userProfile.nickname === post.writer;

    if (!isAuthor) {
      alert("본인이 작성한 게시글만 수정할 수 있습니다.");
      return;
    }

    // 작성자가 맞으면 편집 페이지로 이동
    console.log("Edit post:", postId);
    router.push(`/posts/${postId}/edit`);
  };

  const headerDropdownItems: DropdownActionItem[] = [
    {
      label: "수정",
      onClick: handleEditPost,
    },
    {
      label: "삭제",
      onClick: handleDeletePost,
    },
  ];

  return <DropdownMenuList triggerElement={triggerElement} items={headerDropdownItems} />;
}
