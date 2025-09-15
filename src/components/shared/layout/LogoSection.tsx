import { BLOG_DESCRIPTIONS } from "@/constants/textConstants";
import Image from "next/image";
import Link from "next/link";

/**
 * 로고 섹션 서버 컴포넌트
 *
 * 단일 책임: 브랜드 로고와 설명 표시
 * 레이아웃 시프트 방지를 위해 서버에서 랜덤 문장 선택
 */
export default function LogoSection() {
  // 서버에서 랜덤 문장 선택 (레이아웃 시프트 방지)
  const randomIndex = Math.floor(Math.random() * BLOG_DESCRIPTIONS.length);
  const description = BLOG_DESCRIPTIONS[randomIndex];

  return (
    <Link
      href={{ pathname: "/" }}
      className="layout-stable mt-3 block cursor-pointer text-center transition-opacity hover:opacity-80 md:mt-5"
    >
      {/* 모바일: 작은 로고, 데스크톱: 원래 크기 */}
      <div className="mx-auto h-[162px] w-[180px] md:h-[230px] md:w-[255px]">
        <Image
          src="/logo2.svg"
          alt="메인페이지 로고 (클릭하면 홈으로 이동)"
          width={255}
          height={230}
          priority
        />
      </div>
      {/* 모바일: 작은 폰트, 데스크톱: 원래 크기 */}
      <p className="mt-2 flex min-h-[2rem] items-center justify-center text-lg font-light md:min-h-[2.5rem] md:text-2xl">
        {description}
      </p>
    </Link>
  );
}
