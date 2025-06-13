import { cn } from "@/lib/utils";
import { Badge } from "./badge";

type TagBadgeProps = {
  tag: string;
  variant?: "filled" | "outline";
};

export default function TagBadge({ tag, variant = "filled" }: TagBadgeProps) {
  // 기존 TagBadge의 고유한 스타일을 정의합니다.
  // shadcn/ui Badge의 기본 스타일(예: text-xs, font-semibold, rounded-full, px-2.5, py-0.5)을 덮어쓰기 위함입니다.
  const customClasses = "rounded-3xl px-2 py-1.5 text-[14px] font-normal"; // font-normal로 명시하여 shadcn의 font-semibold를 덮어씁니다.

  if (variant === "outline") {
    return (
      <Badge
        variant="outline"
        className={cn(
          customClasses,
          "border-[#FAA631] text-[#FAA631] bg-transparent",
          "hover:bg-transparent hover:text-[#FAA631]"
        )}
      >
        # {tag}
      </Badge>
    );
  }
  return (
    <Badge
      variant="secondary"
      className={cn(
        customClasses,
        "bg-[#F2F4F6] text-[#848484] border-transparent",
        "hover:bg-[#F2F4F6]/90 hover:text-[#848484]"
      )}
    >
      # {tag}
    </Badge>
  );
}