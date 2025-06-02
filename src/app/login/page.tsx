import GithubLoginButton from "@/components/GithubLoginButton";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-20">
      <Link href="/">
        <Image
          src="/loginPageImg.svg"
          alt="메인페이지 로고"
          width={320}
          height={230}
          className=""
        />
      </Link>
      <GithubLoginButton />
    </div>
  );
}