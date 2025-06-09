import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserDropdownMenu } from "./UserDropdownMenu";

interface HeaderNavigationProps {
  hideHeader: boolean;
}

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ hideHeader }) => {
  return (
    <nav className="flex items-center gap-2">
      {!hideHeader && (
        <>
          <Link href="/login">
            <Button className="rounded-[63px] bg-[#20242B] px-3 py-1.5 text-white hover:bg-[#1C222E] hover:cursor-pointer text-[12px]">
              로그인
            </Button>
          </Link>
          <UserDropdownMenu />
        </>
      )}
    </nav>
  );
};