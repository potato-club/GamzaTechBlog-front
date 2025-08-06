// 수학 공식 관련 컴포넌트들

export const MarkdownMath = ({ node, children, ...props }: any) => (
  <span className="katex-display-wrapper overflow-x-auto" {...props}>
    {children}
  </span>
);

export const MarkdownInlineMath = ({ node, children, ...props }: any) => (
  <span className="katex-inline-wrapper" {...props}>
    {children}
  </span>
);
