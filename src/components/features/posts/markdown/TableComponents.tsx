// 테이블 관련 컴포넌트들

export const MarkdownTable = ({ node, children, ...props }: any) => (
  <div className="overflow-x-auto my-4">
    <table
      className="border-collapse border-spacing-0 w-full"
      {...props}
    >
      {children}
    </table>
  </div>
);

export const MarkdownThead = ({ node, children, ...props }: any) => (
  <thead {...props}>
    {children}
  </thead>
);

export const MarkdownTh = ({ node, children, ...props }: any) => (
  <th
    className="border border-[#d0d7de] px-3 py-2 text-left font-semibold bg-[#f6f8fa]"
    {...props}
  >
    {children}
  </th>
);

export const MarkdownTd = ({ node, children, ...props }: any) => (
  <td
    className="border border-[#d0d7de] px-3 py-2"
    {...props}
  >
    {children}
  </td>
);
