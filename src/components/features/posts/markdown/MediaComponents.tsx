// 미디어 관련 컴포넌트들

export const MarkdownImage = ({ node, ...props }: any) => (
  <img
    {...props}
    className="h-auto max-w-full"
    loading="lazy"
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
    alt={props.alt || ""}
  />
);

export const MarkdownLink = ({ node, href, children, ...props }: any) => {
  const isExternal = href?.startsWith("http");
  return (
    <a
      {...props}
      href={href}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="text-[#0969da] hover:underline"
    >
      {children}
    </a>
  );
};
