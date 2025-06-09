import Image from "next/image";
import Link from "next/link";

interface HeaderLogoProps {
  className?: string;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ className = "" }) => {
  return (
    <Link href="/" className={`flex cursor-pointer items-center text-[18px] ${className}`}>
      <Image
        src="/logo.png"
        alt="감자 기술 블로그 로고"
        width={43}
        height={43}
      />
      <h1 className="ml-2">
        <span className="font-bold">감자 </span>
        <span className="font-light">Tech Blog</span>
      </h1>
    </Link>
  );
};