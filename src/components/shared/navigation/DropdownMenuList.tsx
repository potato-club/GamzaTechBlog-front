import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DropdownMenuListProps } from "@/types/dropdown";
import Link from "next/link";

export const DropdownMenuList: React.FC<DropdownMenuListProps> = ({
  triggerElement,
  items,
  triggerWrapperClassName,
  contentClassName,
  align = "end",
  sideOffset = 8,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={triggerWrapperClassName}>
        {triggerElement}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "w-36", // 특정 너비 유지
          "shadow-lg", // 기본 shadow-md보다 강한 그림자를 원하면 유지
          contentClassName
        )}
      >
        {items.map((item, index) => {
          const commonItemClasses =
            "block w-full cursor-pointer rounded-sm px-4 py-2 text-sm text-gray-700 outline-none hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-700";
          if (item.isLink && item.href) {
            return (
              <DropdownMenuItem
                key={index}
                asChild
                className={cn(
                  "p-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  item.className
                )}
              >
                <Link href={item.href} className={commonItemClasses}>
                  {item.label === "로그아웃" ? (
                    <span className="text-red-600 hover:text-red-700 focus:text-red-700">
                      {item.label}
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              </DropdownMenuItem>
            );
          }
          return (
            <DropdownMenuItem
              key={index}
              onClick={item.onClick}
              className={cn(commonItemClasses, item.className)}
            >
              {item.label === "로그아웃" ? (
                <span className="text-red-600 hover:text-red-700 focus:text-red-700">
                  {item.label}
                </span>
              ) : (
                item.label
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
