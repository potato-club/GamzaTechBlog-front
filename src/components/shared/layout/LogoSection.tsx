"use client";

import { BLOG_DESCRIPTIONS } from "@/constants/textConstants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * 로고 섹션 서버 컴포넌트
 *
 * 단일 책임: 브랜드 로고와 설명
 *
 * 단일 책임: 브랜드 로고와 설명 표시 + 클릭 시 새로고침
 */
export default function LogoSection() {
  const [description, setDescription] = useState("");
  const router = useRouter();

  // 클라이언트에서 랜덤 문장 선택 및 마운트 상태 설정
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BLOG_DESCRIPTIONS.length);
    setDescription(BLOG_DESCRIPTIONS[randomIndex]);
  }, []);

  const handleClick = () => {
    // 완전한 루트 경로로 이동 후 새로고침
    router.push("/");
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <section
      className="mt-5 cursor-pointer text-center transition-opacity hover:opacity-80"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      <Image
        src="/logo2.svg"
        alt="메인페이지 로고 (클릭하면 새로고침)"
        width={255}
        height={230}
        className="mx-auto"
        priority // 메인 로고는 우선 로딩 (LCP 개선)
      />
      <p className="mt-2 text-2xl font-light">{description}</p>
    </section>
  );
}
