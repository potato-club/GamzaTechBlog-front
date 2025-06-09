import GithubLoginButton from "@/components/GithubLoginButton";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-20">
      <header>
        <Link href="/" aria-label="메인페이지로 이동">
          <Image
            src="/loginPageImg.svg"
            alt="Gamza Tech Blog 로고"
            width={320}
            height={230}
            priority
          />
        </Link>
      </header>

      <section aria-label="로그인">
        <h1 className="sr-only">로그인</h1>
        <GithubLoginButton />
      </section>
    </main>
  );
}