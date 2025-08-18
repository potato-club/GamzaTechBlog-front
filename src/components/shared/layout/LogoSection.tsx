"use client";

import { BLOG_DESCRIPTIONS } from "@/constants/textConstants";
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

  // 클라이언트에서 랜덤 문장 선택 및 마운트 상태 설정
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BLOG_DESCRIPTIONS.length);
    setDescription(BLOG_DESCRIPTIONS[randomIndex]);
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      href="/"
      className="mt-5 block cursor-pointer text-center transition-opacity hover:opacity-80"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo2.svg"
        alt="메인페이지 로고 (클릭하면 홈으로 이동)"
        width={255}
        height={230}
        className="mx-auto"
      />
      <p className="mt-2 text-2xl font-light">{description}</p>
    </a>
  );
}
