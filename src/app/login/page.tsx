import Image from "next/image";
import Link from "next/link";
import LoginLogo from "../../../public/loginPageImg.svg";
import GithubLoginButton from "../../components/GithubLoginButton";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-20">
      <Link href="/">
        <Image
          src={LoginLogo}
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