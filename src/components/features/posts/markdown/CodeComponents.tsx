// 코드 관련 컴포넌트들

export const MarkdownPre = ({ node, children, ...props }: any) => (
  <pre
    className="bg-[#f6f8fa] p-4 rounded-md overflow-x-auto text-sm leading-[1.45] my-4 border border-[#d0d7de]"
    {...props}
  >
    {children}
  </pre>
);

export const MarkdownCode = ({ node, className, children, ...props }: any) => {
  const isInlineCode = !className?.includes('language-');

  if (isInlineCode) {
    return (
      <code
        className="bg-[rgba(175,184,193,0.2)] px-1 py-[0.2em] rounded-md text-[85%] font-mono"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <code className="font-mono" {...props}>
      {children}
    </code>
  );
};
