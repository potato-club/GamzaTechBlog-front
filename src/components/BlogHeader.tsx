import Image from "next/image";
import Link from "next/link";
import blogLogo from "../../public/logo.png";

export default function BlogHeader() {
  return (
    <header className="h-14 flex justify-between">
      <Link href="/" className="flex items-center text-[18px] cursor-pointer">
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
        <button className="bg-[#FAA631] px-3 py-1.5 rounded-[63px] text-white">
          로그인
        </button>
        <button className="bg-[#F2F4F6] px-3 py-1.5 rounded-[63px]">
          회원가입
        </button>
      </div>
    </header>
  );
}
