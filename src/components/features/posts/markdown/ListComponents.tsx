// 리스트 관련 컴포넌트들

export const MarkdownUl = ({ node, children, ...props }: any) => (
  <ul className="mb-4 list-disc pl-8" {...props}>
    {children}
  </ul>
);

export const MarkdownOl = ({ node, children, ...props }: any) => (
  <ol className="mb-4 list-decimal pl-8" {...props}>
    {children}
  </ol>
);

export const MarkdownLi = ({ node, children, ...props }: any) => (
  <li className="mb-1" {...props}>
    {children}
  </li>
);

export const MarkdownInput = ({ node, type, checked, ...props }: any) => {
  if (type === "checkbox") {
    return <input type="checkbox" checked={checked} readOnly className="mr-2" {...props} />;
  }
  return <input type={type} {...props} />;
};
