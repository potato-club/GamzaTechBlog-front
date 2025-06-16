export interface DropdownActionItem {
  label: string;
  onClick?: () => void;
  href?: string;
  isLink?: boolean;
  className?: string; // 개별 아이템 스타일링용
}

export interface DropdownMenuListProps {
  triggerElement: React.ReactNode;
  items: DropdownActionItem[];
  triggerWrapperClassName?: string; // 트리거를 감싸는 요소의 클래스 이름
  contentClassName?: string; // DropdownMenuContent에 적용할 클래스 이름
  align?: "start" | "center" | "end";
  sideOffset?: number;
}