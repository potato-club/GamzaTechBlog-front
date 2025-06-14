import { HeaderLogo } from "./HeaderLogo";
import { HeaderNavigation } from "./HeaderNavigation";

export default function BlogHeader() {
  // if (hideHeader) return null;

  return (
    // 바깥쪽 div: sticky, 전체 너비, 배경색, z-index
    <div className="site-header-sticky-wrapper sticky top-0 z-50 w-full bg-white">
      {/* 안쪽 header: max-width, 중앙 정렬(mx-auto), 실제 콘텐츠 배치 */}
      <header className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-6">
        <HeaderLogo />
        <HeaderNavigation />
      </header>
    </div>
  );
}