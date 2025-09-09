import { cn } from "@/lib/utils";

type TagBadgeProps = {
  tag: string;
  variant?: "filled" | "outline" | "gray";
  onClick?: (tag: string) => void;
  className?: string;
};

export default function TagBadge({ tag, variant = "filled", onClick, className }: TagBadgeProps) {
  // 기존 TagBadge의 고유한 스타일을 정의합니다.
  // shadcn/ui Badge의 기본 스타일(예: text-xs, font-semibold, rounded-full, px-2.5, py-0.5)을 덮어쓰기 위함입니다.
  const customClasses =
    "rounded-3xl px-2 py-1.5 text-[14px] font-normal w-fit min-w-0 will-change-transform"; // font-normal로 명시하여 shadcn의 font-semibold를 덮어씁니다.

  const handleClick = () => {
    if (onClick) {
      onClick(tag);
    }
  };

  if (variant === "gray") {
    // PostMeta에서 사용하는 회색 스타일
    return (
      <div
        className={cn(
          customClasses,
          "inline-flex items-center justify-center border-none bg-[#F2F4F6] text-[#848484]",
          onClick && "cursor-pointer",
          className
        )}
      >
        # {tag}
      </div>
    );
  }
  if (variant === "outline") {
    return (
      <div
        onClick={handleClick}
        className={cn(
          customClasses,
          "inline-flex items-center justify-center border border-[#FAA631] bg-[#FAA631]",
          "transition-colors hover:bg-[#FAA631]/90",
          onClick && "cursor-pointer",
          className
        )}
      >
        <span className="font-normal text-white"># {tag}</span>
      </div>
    );
  }
  return (
    <div
      onClick={handleClick}
      className={cn(
        customClasses,
        "inline-flex items-center justify-center border border-[#FAA631] bg-transparent text-[#FAA631]",
        onClick && "cursor-pointer",
        className
      )}
    >
      # {tag}
    </div>
  );
}
