import type { ComponentProps } from "react";

// 테이블 관련 컴포넌트들

export const MarkdownTable = ({ children, ...props }: ComponentProps<"table">) => (
  <div className="my-4 overflow-x-auto">
    <table className="w-full border-collapse border-spacing-0" {...props}>
      {children}
    </table>
  </div>
);

export const MarkdownThead = ({ children, ...props }: ComponentProps<"thead">) => (
  <thead {...props}>{children}</thead>
);

export const MarkdownTh = ({ children, ...props }: ComponentProps<"th">) => (
  <th className="border border-[#d0d7de] bg-[#f6f8fa] px-3 py-2 text-left font-semibold" {...props}>
    {children}
  </th>
);

export const MarkdownTd = ({ children, ...props }: ComponentProps<"td">) => (
  <td className="border border-[#d0d7de] px-3 py-2" {...props}>
    {children}
  </td>
);
