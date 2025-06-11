"use client";

import Image from "next/image";

export default function GithubLoginButton() {
  const handleGithubLogin = () => {
    window.location.href = "http://gamzatech.site:8888/login/oauth2/code/github";
  };

  return (
    <button
      onClick={handleGithubLogin}
      type="button"
      className="hover:cursor-pointer"
    >
      <Image
        src="/githubLoginBtn.svg"
        alt="GitHub 로고"
        className="mr-2"
        width={380}
        height={56}
      />
    </button>
  );
}