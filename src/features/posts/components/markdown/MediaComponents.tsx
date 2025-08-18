import Image from "next/image";
import type { ComponentProps } from "react";

// 미디어 관련 컴포넌트들

export const MarkdownImage = ({ ...props }: ComponentProps<"img">) => (
  <span className="relative block h-96 w-full">
    <Image
      src={typeof props.src === "string" ? props.src : ""}
      alt={props.alt || ""}
      fill
      style={{ objectFit: "contain" }}
      className="h-auto max-w-full"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
      unoptimized
    />
  </span>
);

export const MarkdownLink = ({ href, children, ...props }: ComponentProps<"a">) => {
  const isExternal = href?.startsWith("http");
  return (
    <a
      {...props}
      href={href}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="text-[#0969da] hover:underline"
    >
      {children}
    </a>
  );
};
