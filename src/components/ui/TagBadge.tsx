import { cn } from "@/lib/utils";

type TagBadgeProps = {
  tag: string;
  variant?: "filled" | "outline";
  onClick?: (tag: string) => void;
  className?: string;
};

export default function TagBadge({ tag, variant = "filled", onClick, className }: TagBadgeProps) {
  // 기존 TagBadge의 고유한 스타일을 정의합니다.
  // shadcn/ui Badge의 기본 스타일(예: text-xs, font-semibold, rounded-full, px-2.5, py-0.5)을 덮어쓰기 위함입니다.
  const customClasses = "rounded-3xl px-2 py-1.5 text-[14px] font-normal"; // font-normal로 명시하여 shadcn의 font-semibold를 덮어씁니다.

  const handleClick = () => {
    if (onClick) {
      onClick(tag);
    }
  };

  if (variant === "outline") {
    return (
      <div
        onClick={handleClick}
        className={cn(
          customClasses,
          "bg-[#FAA631] border border-[#FAA631] inline-flex items-center justify-center",
          "hover:bg-[#FAA631]/90 transition-colors",
          onClick && "cursor-pointer",
          className
        )}
      >
        <span
          className="font-bold text-transparent"
          style={{
            background: 'white',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          # {tag}
        </span>
      </div>
    );
  }
  return (
    <div
      onClick={handleClick}
      className={cn(
        customClasses,
        "bg-transparent border border-[#FAA631] text-[#FAA631] inline-flex items-center justify-center",
        "hover:bg-[#FAA631]/5 hover:text-[#FAA631] transition-colors",
        onClick && "cursor-pointer",
        className
      )}
    >
      # {tag}
    </div>
  );
}