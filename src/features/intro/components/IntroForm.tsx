"use client";

import { Button } from "@/components/ui/button";
import { INTRO_TEXTS } from "@/constants/uiTexts";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useCreateIntro } from "../hooks";

export default function IntroForm() {
  const { userProfile, isLoggedIn } = useAuth();
  const createIntroMutation = useCreateIntro();
  const [content, setContent] = useState("");

  // 이미지 URL 가져오기 함수
  const getUserImageUrl = () => {
    if (!userProfile) return "/profileSVG.svg";
    return userProfile.profileImageUrl || "/profileSVG.svg";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (!content.trim()) {
      toast.error("자기소개 내용을 입력해주세요.");
      return;
    }

    try {
      await createIntroMutation.mutateAsync(content.trim());
      setContent("");
      toast.success("자기소개가 등록되었습니다!");
    } catch (error) {
      console.error("자기소개 등록 실패:", error);
      toast.error("자기소개 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 로그인하지 않은 사용자를 위한 UI
  if (!isLoggedIn) {
    return (
      <div className="mt-4 rounded-xl border border-[#E7EEFE] px-6 py-8 text-center">
        <p className="text-sm text-gray-600">자기소개를 작성하려면 로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit} aria-label="자기소개 작성">
      <div className="flex flex-col items-start gap-3 md:flex-row">
        <div className="flex w-full items-center gap-3 md:w-auto">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <Image
              src={getUserImageUrl()}
              alt="현재 사용자의 프로필 이미지"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-[14px] font-medium text-[#1C222E] md:hidden">
            {userProfile?.nickname || "undefined"}
          </span>
        </div>
        <textarea
          id="intro-input"
          placeholder={INTRO_TEXTS.WELCOME_PLACEHOLDER}
          className="min-h-[80px] w-full resize-none rounded-xl border border-[#E7EEFE] px-5 py-3.5 text-sm text-gray-800 transition focus:ring-2 focus:ring-[#FAA631]/50 focus:outline-none"
          aria-required="true"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={createIntroMutation.isPending}
        />
      </div>
      <div className="flex items-center justify-end">
        <Button
          type="submit"
          className="w-full rounded-[63px] bg-[#20242B] px-3 py-1.5 text-[12px] text-white hover:bg-[#1C222E] md:w-auto"
          disabled={createIntroMutation.isPending || !content.trim()}
        >
          {createIntroMutation.isPending ? "등록 중..." : "등록"}
        </Button>
      </div>
    </form>
  );
}
