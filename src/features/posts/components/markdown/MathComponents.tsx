import type { ComponentProps } from "react";

// 수학 공식 관련 컴포넌트들

export const MarkdownMath = ({ children, ...props }: ComponentProps<"span">) => (
  <span className="katex-display-wrapper overflow-x-auto" {...props}>
    {children}
  </span>
);

export const MarkdownInlineMath = ({ children, ...props }: ComponentProps<"span">) => (
  <span className="katex-inline-wrapper" {...props}>
    {children}
  </span>
);
