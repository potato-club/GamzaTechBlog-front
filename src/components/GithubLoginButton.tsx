"use client";

import Image from "next/image";
import githubLoginImage from "../../public/githubLoginBtn.svg";

export default function GithubLoginButton() {
  const handleGithubLogin = () => {
    window.location.href = "https://your-backend-domain.com/api/auth/github/login";
  };

  return (
    <button
      onClick={handleGithubLogin}
      type="button"
      className="hover:cursor-pointer"
    >
      <Image
        src={githubLoginImage}
        alt="GitHub 로고"
        className="mr-2"
      />
    </button>
  );
}