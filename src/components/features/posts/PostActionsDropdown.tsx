"use client";

import { DropdownMenuList } from "@/components/common/DropdownMenuList";
import { useDeletePost } from "@/hooks/queries/usePostQueries";
import { DropdownActionItem } from "@/types/dropdown";
import { useRouter } from "next/navigation";

interface PostActionsDropdownProps {
  postId: number;
  triggerElement: React.ReactNode;
}

export function PostActionsDropdown({ postId, triggerElement }: PostActionsDropdownProps) {
  const router = useRouter();
  const deletePostMutation = useDeletePost();

  const handleDeletePost = () => {
    deletePostMutation.mutate(postId);
  };

  const handleEditPost = () => {
    // 편집 로직 구현
    console.log('Edit post:', postId);
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

  return (
    <DropdownMenuList
      triggerElement={triggerElement}
      items={headerDropdownItems}
    />
  );
}