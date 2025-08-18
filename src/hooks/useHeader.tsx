import { usePathname } from "next/navigation";

export const useHeader = () => {
  const pathname = usePathname();
  const hideHeaderPaths = ["/login", "/signup"];
  const hideHeader = hideHeaderPaths.some((path) => pathname.startsWith(path));

  return { hideHeader, pathname };
};
