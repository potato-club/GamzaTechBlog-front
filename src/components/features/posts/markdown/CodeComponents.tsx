// 코드 관련 컴포넌트들

export const MarkdownPre = ({ node, children, ...props }: any) => (
  <div className="relative my-4">
    <pre
      className="bg-[#f6f8fa] p-4 rounded-md overflow-x-auto text-sm leading-[1.45] border border-[#d0d7de] 
                 hljs" // hljs 클래스 추가로 highlight.js 스타일 적용
      {...props}
    >
      {children}
    </pre>
  </div>
);

export const MarkdownCode = ({ node, className, children, ...props }: any) => {
  const isInlineCode = !className?.includes('language-');

  if (isInlineCode) {
    return (
      <code
        className="bg-[rgba(175,184,193,0.2)] px-1 py-[0.2em] rounded-md text-[85%] font-mono text-[#d73a49]"
        {...props}
      >
        {children}
      </code>
    );
  }

  // 코드 블록의 경우 highlight.js가 처리하도록
  return (
    <code
      className={`font-mono ${className || ''}`}
      {...props}
    >
      {children}
    </code>
  );
};
