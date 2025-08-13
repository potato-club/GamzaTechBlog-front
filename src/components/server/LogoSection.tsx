import { BLOG_DESCRIPTIONS } from "@/constants/textConstants";
import Image from "next/image";

/**
 * 로고 섹션 서버 컴포넌트
 *
 * 단일 책임: 브랜드 로고와 설명 표시
 */
export default function LogoSection() {
  // 서버에서 랜덤 문장 선택 (매 요청마다 다름)
  const randomIndex = Math.floor(Math.random() * BLOG_DESCRIPTIONS.length);
  const description = BLOG_DESCRIPTIONS[randomIndex];

  return (
    <section className="mt-5 text-center">
      <Image
        src="/logo2.svg"
        alt="메인페이지 로고"
        width={255}
        height={230}
        className="mx-auto"
        priority // 메인 로고는 우선 로딩 (LCP 개선)
      />
      <p className="mt-2 text-2xl font-light">{description}</p>
    </section>
  );
}
