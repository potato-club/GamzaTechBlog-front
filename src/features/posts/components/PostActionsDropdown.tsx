"use client";

import { DropdownMenuList } from "@/components/shared/navigation/DropdownMenuList";
import { Button } from "@/components/ui/button";
import { UI_CONSTANTS } from "@/constants/ui";
import { useDeletePost } from "@/features/posts";
import { cn } from "@/lib/utils";
import { DropdownActionItem } from "@/types/dropdown";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface PostActionsDropdownProps {
  postId: number;
}

export function PostActionsDropdown({ postId }: PostActionsDropdownProps) {
  const router = useRouter();

  const deletePostMutation = useDeletePost();

  const handleDeletePost = useCallback(async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    await deletePostMutation.mutateAsync({ postId });
  }, [deletePostMutation, postId]);

  const handleEditPost = useCallback(() => {
    router.push(`/posts/${postId}/edit`);
  }, [postId, router]);

  const headerDropdownItems: DropdownActionItem[] = [
    {
      label: UI_CONSTANTS.ACTIONS.POST.EDIT,
      onClick: handleEditPost,
      ariaLabel: UI_CONSTANTS.ACTIONS.POST.EDIT_ARIA_LABEL,
      shortcut: "Ctrl+E",
    },
    {
      label: UI_CONSTANTS.ACTIONS.POST.DELETE,
      onClick: handleDeletePost,
      ariaLabel: UI_CONSTANTS.ACTIONS.POST.DELETE_ARIA_LABEL,
      shortcut: "Delete",
      variant: "destructive",
    },
  ];

  const triggerElement = (
    <Button
      variant="ghost"
      className={cn(
        "relative ml-auto h-8 w-8 rounded-full p-0 hover:cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/dot3.svg" alt="더보기" width={18} height={4} />
    </Button>
  );

  return <DropdownMenuList triggerElement={triggerElement} items={headerDropdownItems} />;
}
