import type { ComponentProps } from "react";

// 코드 관련 컴포넌트들

export const MarkdownPre = ({ children, ...props }: ComponentProps<"pre">) => (
  <div className="relative my-4">
    <pre
      className="hljs overflow-x-auto rounded-md border border-[#d0d7de] bg-[#f6f8fa] p-4 text-sm leading-[1.45]" // hljs 클래스 추가로 highlight.js 스타일 적용
      {...props}
    >
      {children}
    </pre>
  </div>
);

export const MarkdownCode = ({ className, children, ...props }: ComponentProps<"code">) => {
  const isInlineCode = !className?.includes("language-");

  if (isInlineCode) {
    return (
      <code
        className="rounded-md bg-[rgba(175,184,193,0.2)] px-1 py-[0.2em] font-mono text-[85%] text-[#d73a49]"
        {...props}
      >
        {children}
      </code>
    );
  }

  // 코드 블록의 경우 highlight.js가 처리하도록
  return (
    <code className={`font-mono ${className || ""}`} {...props}>
      {children}
    </code>
  );
};
