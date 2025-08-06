// 텍스트 관련 컴포넌트들

export const MarkdownH1 = ({ node, children, ...props }: any) => (
  <h1 className="mt-6 mb-4 border-b border-[#d0d7de] pb-2 text-[2em] font-semibold" {...props}>
    {children}
  </h1>
);

export const MarkdownH2 = ({ node, children, ...props }: any) => (
  <h2 className="mt-6 mb-4 border-b border-[#d0d7de] pb-2 text-[1.5em] font-semibold" {...props}>
    {children}
  </h2>
);

export const MarkdownH3 = ({ node, children, ...props }: any) => (
  <h3 className="mt-6 mb-4 text-[1.25em] font-semibold" {...props}>
    {children}
  </h3>
);

export const MarkdownH4 = ({ node, children, ...props }: any) => (
  <h4 className="mt-6 mb-4 text-[1em] font-semibold" {...props}>
    {children}
  </h4>
);

export const MarkdownH5 = ({ node, children, ...props }: any) => (
  <h5 className="mt-6 mb-4 text-[0.875em] font-semibold" {...props}>
    {children}
  </h5>
);

export const MarkdownH6 = ({ node, children, ...props }: any) => (
  <h6 className="mt-6 mb-4 text-[0.85em] font-semibold text-[#656d76]" {...props}>
    {children}
  </h6>
);

export const MarkdownP = ({ node, children, ...props }: any) => (
  <p className="mb-4 leading-[1.6]" {...props}>
    {children}
  </p>
);

export const MarkdownStrong = ({ node, children, ...props }: any) => (
  <strong className="font-semibold" {...props}>
    {children}
  </strong>
);

export const MarkdownEm = ({ node, children, ...props }: any) => (
  <em className="italic" {...props}>
    {children}
  </em>
);

export const MarkdownDel = ({ node, children, ...props }: any) => (
  <del className="line-through" {...props}>
    {children}
  </del>
);

export const MarkdownBlockquote = ({ node, children, ...props }: any) => (
  <blockquote className="my-4 border-l-[0.25em] border-[#d0d7de] pl-4 text-[#656d76]" {...props}>
    {children}
  </blockquote>
);

export const MarkdownHr = ({ node, ...props }: any) => (
  <hr className="my-6 h-[0.25em] border-0 border-t border-[#d0d7de] bg-[#d0d7de]" {...props} />
);
