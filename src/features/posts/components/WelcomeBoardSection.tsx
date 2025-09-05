"use client";

import { IntroForm, IntroList } from "@/features/intro";

export default function WelcomeBoardSection() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">텃밭인사</h2>
        <p className="text-gray-600">
          감자 기술 블로그에 오신 것을 환영합니다! 간단한 자기소개를 남겨주세요.
        </p>
      </div>

      {/* 자기소개 작성 폼 */}
      <div className="mb-8">
        <IntroForm />
      </div>

      {/* 자기소개 목록 */}
      <IntroList />
    </div>
  );
}
