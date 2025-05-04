import Image from "next/image";
import Link from "next/link";
import blogLogo from "../../public/logo.png";

export default function BlogHeader() {
  return (
    // <header className="flex h-14 justify-between">
    <header className="fixed top-0 left-0 z-50 flex h-14 w-full items-center justify-between bg-white px-[80px]">
      <Link href="/" className="flex cursor-pointer items-center text-[18px]">
        <Image
          src={blogLogo}
          alt="감자 기술 블로그 로고"
          width={43}
          height={43}
          className="opacity-55"
        />
        <span>
          <span className="font-bold">감자 </span>
          <span className="font-light">Tech Blog</span>
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <button className="rounded-[63px] bg-[#FAA631] px-3 py-1.5 text-white">
          로그인
        </button>
        <button className="rounded-[63px] bg-[#F2F4F6] px-3 py-1.5">
          회원가입
        </button>
      </div>
    </header>
  );
}
