import type { ComponentProps } from "react";

// 리스트 관련 컴포넌트들

export const MarkdownUl = ({ children, ...props }: ComponentProps<"ul">) => (
  <ul className="mb-4 list-disc pl-8" {...props}>
    {children}
  </ul>
);

export const MarkdownOl = ({ children, ...props }: ComponentProps<"ol">) => (
  <ol className="mb-4 list-decimal pl-8" {...props}>
    {children}
  </ol>
);

export const MarkdownLi = ({ children, ...props }: ComponentProps<"li">) => (
  <li className="mb-1" {...props}>
    {children}
  </li>
);

export const MarkdownInput = ({ type, checked, ...props }: ComponentProps<"input">) => {
  if (type === "checkbox") {
    return <input type="checkbox" checked={checked} readOnly className="mr-2" {...props} />;
  }
  return <input type={type} {...props} />;
};
