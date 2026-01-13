// Layout Components (Client-safe)
export { default as BlogHeader } from "./layout/BlogHeader";
export { default as Footer } from "./layout/Footer";
export { HeaderLogo } from "./layout/HeaderLogo";
export { HeaderNavigation } from "./layout/HeaderNavigation";
export { default as LogoSection } from "./layout/LogoSection";

// Layout Skeletons
export { default as LogoSkeleton } from "./layout/skeletons/LogoSkeleton";
export { default as SidebarSkeleton } from "./layout/skeletons/SidebarSkeleton";

// Navigation Components
export { default as CustomPagination } from "./navigation/CustomPagination";
export { DropdownMenuList } from "./navigation/DropdownMenuList";
export { default as OptimizedLink } from "./navigation/OptimizedLink";
export { default as TabMenu } from "./navigation/TabMenu";

// Pagination Components
export { default as PaginationWrapper } from "./pagination/PaginationWrapper";

// Common UI Components
export { default as EmptyState } from "./EmptyState";
export { default as ErrorDisplay } from "./ErrorDisplay";
export { default as WelcomeModal } from "./interactive/WelcomeModal";

// Skeletons
export { default as MainPageSkeleton } from "./skeletons/MainPageSkeleton";
export { default as MyPageSidebarSkeleton } from "./skeletons/MyPageSidebarSkeleton";
export { default as TabContentSkeleton } from "./skeletons/TabContentSkeleton";

// ⚠️ Server Components는 barrel export에서 제외합니다.
// 직접 import하세요:
// import ProfileLayout from "@/components/shared/layout/ProfileLayout";
// import SidebarSection from "@/components/shared/layout/SidebarSection.server";
