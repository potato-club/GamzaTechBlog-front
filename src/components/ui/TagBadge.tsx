
type TagBadgeProps = {
  tag: string;
  variant?: "filled" | "outline";
};

export default function TagBadge({ tag, variant = "filled" }: TagBadgeProps) {
  if (variant === "outline") {
    return (
      <div className="w-fit rounded-3xl px-2 py-1.5 text-[#FAA631] border border-[#FAA631] text-[14px]">
        # {tag}
      </div>
    );
  }
  return (
    <div className="w-fit rounded-3xl bg-[#F2F4F6] px-2 py-1.5 text-[#848484] text-[14px]">
      # {tag}
    </div>
  );
}