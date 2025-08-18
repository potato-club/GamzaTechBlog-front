import type { ComponentProps } from "react";

// 텍스트 관련 컴포넌트들

export const MarkdownH1 = ({ children, ...props }: ComponentProps<"h1">) => (
  <h1 className="mt-6 mb-4 border-b border-[#d0d7de] pb-2 text-[2em] font-semibold" {...props}>
    {children}
  </h1>
);

export const MarkdownH2 = ({ children, ...props }: ComponentProps<"h2">) => (
  <h2 className="mt-6 mb-4 border-b border-[#d0d7de] pb-2 text-[1.5em] font-semibold" {...props}>
    {children}
  </h2>
);

export const MarkdownH3 = ({ children, ...props }: ComponentProps<"h3">) => (
  <h3 className="mt-6 mb-4 text-[1.25em] font-semibold" {...props}>
    {children}
  </h3>
);

export const MarkdownH4 = ({ children, ...props }: ComponentProps<"h4">) => (
  <h4 className="mt-6 mb-4 text-[1em] font-semibold" {...props}>
    {children}
  </h4>
);

export const MarkdownH5 = ({ children, ...props }: ComponentProps<"h5">) => (
  <h5 className="mt-6 mb-4 text-[0.875em] font-semibold" {...props}>
    {children}
  </h5>
);

export const MarkdownH6 = ({ children, ...props }: ComponentProps<"h6">) => (
  <h6 className="mt-6 mb-4 text-[0.85em] font-semibold text-[#656d76]" {...props}>
    {children}
  </h6>
);

export const MarkdownP = ({ children, ...props }: ComponentProps<"p">) => (
  <p className="mb-4 leading-[1.6]" {...props}>
    {children}
  </p>
);

export const MarkdownStrong = ({ children, ...props }: ComponentProps<"strong">) => (
  <strong className="font-semibold" {...props}>
    {children}
  </strong>
);

export const MarkdownEm = ({ children, ...props }: ComponentProps<"em">) => (
  <em className="italic" {...props}>
    {children}
  </em>
);

export const MarkdownDel = ({ children, ...props }: ComponentProps<"del">) => (
  <del className="line-through" {...props}>
    {children}
  </del>
);

export const MarkdownBlockquote = ({ children, ...props }: ComponentProps<"blockquote">) => (
  <blockquote className="my-4 border-l-[0.25em] border-[#d0d7de] pl-4 text-[#656d76]" {...props}>
    {children}
  </blockquote>
);

export const MarkdownHr = ({ ...props }: ComponentProps<"hr">) => (
  <hr className="my-6 h-[0.25em] border-0 border-t border-[#d0d7de] bg-[#d0d7de]" {...props} />
);
