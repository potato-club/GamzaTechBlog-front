"use client";

import { useHeader } from "@/hooks/useHeader";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderNavigation } from "./HeaderNavigation";

export default function BlogHeader() {
  const { hideHeader } = useHeader();

  // if (hideHeader) return null;

  return (
    <header className="fixed top-0 left-1/2 z-50 flex h-14 w-full max-w-[1100px] -translate-x-1/2 items-center justify-between bg-white px-6">
      <HeaderLogo />
      <HeaderNavigation hideHeader={hideHeader} />
    </header>
  );
}