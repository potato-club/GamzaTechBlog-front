"use client";

import { DropdownMenuList } from "@/components/shared/navigation/DropdownMenuList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/features/user/hooks/useUserQueries";
import { IntroResponse } from "@/generated/api";
import { DropdownActionItem } from "@/types/dropdown";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteIntro } from "../hooks";

interface IntroCardProps {
  intro: IntroResponse;
}

export default function IntroCard({ intro }: IntroCardProps) {
  const { userProfile } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteIntroMutation = useDeleteIntro();

  const openDeleteDialog = () => {
    if (deleteIntroMutation.isPending || typeof intro.introId !== "number") return;
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteIntroMutation.isPending || typeof intro.introId !== "number") return;

    try {
      await deleteIntroMutation.mutateAsync(intro.introId);
      setIsDeleteDialogOpen(false);
      toast.success("자기소개가 삭제되었습니다.");
    } catch (error) {
      console.error("자기소개 삭제 실패:", error);
      toast.error("자기소개 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  // 현재 사용자가 자기소개 작성자인지 확인
  const isCurrentUserIntroOwner = (() => {
    if (!userProfile || !intro.nickname) return false;
    return intro.nickname === userProfile.nickname;
  })();

  const introDropdownItems: DropdownActionItem[] = [
    {
      label: deleteIntroMutation.isPending ? "삭제 중..." : "삭제하기",
      onClick: openDeleteDialog,
      className: `w-full text-left ${deleteIntroMutation.isPending ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-700 focus:text-red-700 hover:bg-red-50 focus:bg-red-50"}`,
    },
  ];

  const introTriggerElement = (
    <button
      type="button"
      aria-label="자기소개 옵션 더보기"
      className={`p-1 hover:cursor-pointer hover:opacity-80 ${deleteIntroMutation.isPending ? "cursor-not-allowed" : ""}`}
    >
      <Image src="/dot3.svg" alt="더보기" width={18} height={4} />
    </button>
  );

  return (
    <>
      <div className="w-full rounded-xl bg-[#FAFBFF] px-6 py-5">
        <div className="relative">
          {isCurrentUserIntroOwner && introDropdownItems.length > 0 && (
            <div className="absolute top-0 right-0">
              <DropdownMenuList
                triggerElement={introTriggerElement}
                items={introDropdownItems}
                contentClassName="w-28"
              />
            </div>
          )}
        </div>

        {/* 사용자 프로필 정보 표시 */}
        {intro.nickname && (
          <div className="mt-1 flex items-center gap-2">
            <div className="mr-2 h-9 w-9 overflow-hidden rounded-full">
              <Image
                src={intro.profileImageUrl || "/profileSVG.svg"}
                alt={`${intro.nickname}의 프로필 이미지`}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-[14px] font-medium text-[#1C222E]">{intro.nickname}</span>
          </div>
        )}

        <div className="mt-2 text-[14px] text-[#464C58]">{intro.content}</div>

        {intro.createdAt && (
          <div className="mt-2 text-[12px] text-[#B5BBC7]">
            <time dateTime={new Date(intro.createdAt).toISOString()}>
              {new Date(intro.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </time>
          </div>
        )}
      </div>

      {/* 자기소개 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>자기소개 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              {`'${(intro.content ?? "").substring(0, 30).trim()}${(intro.content ?? "").length > 30 ? "..." : ""}' 자기소개를 정말 삭제하시겠습니까?`}
              <br />이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteIntroMutation.isPending}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteIntroMutation.isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteIntroMutation.isPending ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
