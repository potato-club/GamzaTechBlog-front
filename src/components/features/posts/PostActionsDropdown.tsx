"use client";

import { DropdownMenuList } from "@/components/common/DropdownMenuList";
import { useDeletePost } from "@/hooks/queries/usePostQueries";
import { DropdownActionItem } from "@/types/dropdown";

interface PostActionsDropdownProps {
  postId: number;
  triggerElement: React.ReactNode;
}

export function PostActionsDropdown({ postId, triggerElement }: PostActionsDropdownProps) {
  const deletePostMutation = useDeletePost();

  const handleDeletePost = () => {
    deletePostMutation.mutate(postId);
  };

  const handleEditPost = () => {
    // 편집 로직 구현
    console.log('Edit post:', postId);
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