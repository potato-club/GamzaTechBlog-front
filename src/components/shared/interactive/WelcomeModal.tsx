"use client";

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
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const shouldShowModal = !localStorage.getItem("hideWelcomeModal");
    if (shouldShowModal) {
      setOpen(true);
    }
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (dontShowAgain) {
        localStorage.setItem("hideWelcomeModal", "true");
      }
    }
    setOpen(isOpen);
  };

  const handleLearnMore = () => {
    router.push("/posts/45");
  };

  if (!open) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="w-full border-none px-11 sm:max-w-[1000px]">
        <AlertDialogHeader className="gap-10">
          <AlertDialogTitle className="mt-5 text-center text-[28px]">
            🥔 감자 기술 블로그란? 🥔
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[18px] text-black">
            <p className="mt-4">
              감자 기술 블로그는 한세대학교 웹·앱 개발 동아리{" "}
              <span className="font-bold">감자</span> 구성원들을 위해 만들어진 지식 공유 공간입니다!
            </p>
            <p className="mt-4">
              감자 동아리 안에서도 사람마다 배워온 시간이 다르고 이해 속도도 다르기 때문에
              <br />
              “선배들은 어떻게 공부했을까?”, “이 기술은 어떻게 공부해야 할까?” 등과 같은 고민이
              생기기 마련입니다.
              <br />
              그래서 각자가 공부하면서 겪은 시행착오, 팁, 학습 방법 등을 글로 정리하고 서로
              공유하면서
              <br />
              지식을 쌓아갈 수 있는 <span className="font-bold">배움의 공간</span>을 만들고자 이
              기술 블로그를 만들었습니다.
            </p>
            <p className="mt-4">
              감자 기술 블로그는 <span className="font-bold">깃허브 연동 기반</span>으로 운영되어
              가입 또한 깃허브 계정으로만 할 수 있습니다.
              <br />
              그렇기 때문에 블로그에 게시글을 작성하면 본인의 깃허브에도 자동으로 업로드되어
              수정이나 삭제도 가능합니다.
            </p>
            <p className="mt-4">
              아쉽게도 글 작성은 감자 동아리원만 가능하지만,{" "}
              <span className="font-bold">
                모든 게시글은 외부에서도 자유롭게 볼 수 있도록 열려 있습니다.
              </span>
              <br />
              혹시 감자 기술 블로그가 마음에 들었다면, 감자 동아리에 지원하여 함께 지식을 나눠보세요
              😊
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-16 flex items-center space-x-2">
          <Checkbox
            id="dont-show-again"
            checked={dontShowAgain}
            onCheckedChange={() => setDontShowAgain(!dontShowAgain)}
          />
          <label
            htmlFor="dont-show-again"
            className="text-sm leading-none font-medium text-[#6A7181] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            다시 보지 않기
          </label>
        </div>
        <AlertDialogFooter className="mx-[-44px] mt-6 mb-[-24px] flex flex-row gap-0 p-0">
          <AlertDialogCancel className="h-[60px] flex-1 rounded-none rounded-bl-lg text-[18px] focus-visible:ring-0">
            닫기
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLearnMore}
            className="h-[60px] flex-1 rounded-none rounded-br-lg text-[18px]"
          >
            자세히 보기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
