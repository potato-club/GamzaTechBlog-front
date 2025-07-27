import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownViewer({ content }: { content: string; }) {
  return (
    <div className="prose prose-slate prose-lg max-w-full 
                    [&_ul]:list-disc [&_ol]:list-decimal 
                    [&_ul]:ml-6 [&_ol]:ml-6 
                    [&_li]:mb-2 my-6 text-[17px] text-[#474F5D] leading-relaxed
                    break-words overflow-wrap-anywhere
                    [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_pre]:whitespace-pre-wrap
                    [&_code]:break-words [&_code]:max-w-full
                    [&_table]:overflow-x-auto [&_table]:max-w-full
                    [&_img]:max-w-full [&_img]:h-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 이미지 - GitHub 스타일
          img: ({ node, ...props }) => (
            <img
              {...props}
              className="max-w-full h-auto"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              alt={props.alt || ''}
            />
          ),

          // 링크 - GitHub 스타일
          a: ({ node, href, children, ...props }) => {
            const isExternal = href?.startsWith('http');
            return (
              <a
                {...props}
                href={href}
                target={isExternal ? '_blank' : '_self'}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="text-[#0969da] hover:underline"
              >
                {children}
              </a>
            );
          },

          // 인용구 - GitHub 스타일
          blockquote: ({ node, children, ...props }) => (
            <blockquote
              className="border-l-[0.25em] border-[#d0d7de] pl-4 text-[#656d76] my-4"
              {...props}
            >
              {children}
            </blockquote>
          ),

          // 코드 블록 - GitHub 스타일
          pre: ({ node, children, ...props }) => (
            <pre
              className="bg-[#f6f8fa] p-4 rounded-md overflow-x-auto text-sm leading-[1.45] my-4 border border-[#d0d7de]"
              {...props}
            >
              {children}
            </pre>
          ),

          // 인라인 코드 - GitHub 스타일
          code: ({ node, className, children, ...props }) => {
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

            // 코드 블록 내부의 코드
            return (
              <code className="font-mono" {...props}>
                {children}
              </code>
            );
          },

          // 테이블 - GitHub 스타일
          table: ({ node, children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table
                className="border-collapse border-spacing-0 w-full"
                {...props}
              >
                {children}
              </table>
            </div>
          ),

          thead: ({ node, children, ...props }) => (
            <thead {...props}>
              {children}
            </thead>
          ),

          th: ({ node, children, ...props }) => (
            <th
              className="border border-[#d0d7de] px-3 py-2 text-left font-semibold bg-[#f6f8fa]"
              {...props}
            >
              {children}
            </th>
          ),

          td: ({ node, children, ...props }) => (
            <td
              className="border border-[#d0d7de] px-3 py-2"
              {...props}
            >
              {children}
            </td>
          ),

          // 체크박스 - GitHub 스타일
          input: ({ node, type, checked, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },

          // 헤딩 - GitHub 스타일
          h1: ({ node, children, ...props }) => (
            <h1 className="text-[2em] font-semibold mt-6 mb-4 pb-2 border-b border-[#d0d7de]" {...props}>
              {children}
            </h1>
          ),

          h2: ({ node, children, ...props }) => (
            <h2 className="text-[1.5em] font-semibold mt-6 mb-4 pb-2 border-b border-[#d0d7de]" {...props}>
              {children}
            </h2>
          ),

          h3: ({ node, children, ...props }) => (
            <h3 className="text-[1.25em] font-semibold mt-6 mb-4" {...props}>
              {children}
            </h3>
          ),

          h4: ({ node, children, ...props }) => (
            <h4 className="text-[1em] font-semibold mt-6 mb-4" {...props}>
              {children}
            </h4>
          ),

          h5: ({ node, children, ...props }) => (
            <h5 className="text-[0.875em] font-semibold mt-6 mb-4" {...props}>
              {children}
            </h5>
          ),

          h6: ({ node, children, ...props }) => (
            <h6 className="text-[0.85em] font-semibold mt-6 mb-4 text-[#656d76]" {...props}>
              {children}
            </h6>
          ),

          // 수평선 - GitHub 스타일
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-0 border-t border-[#d0d7de] h-[0.25em] bg-[#d0d7de]" {...props} />
          ),

          // 단락 - GitHub 스타일
          p: ({ node, children, ...props }) => (
            <p className="mb-4 leading-[1.6]" {...props}>
              {children}
            </p>
          ),

          // 리스트 아이템 - GitHub 스타일
          li: ({ node, children, ...props }) => (
            <li className="mb-1" {...props}>
              {children}
            </li>
          ),

          // 순서 없는 리스트 - GitHub 스타일
          ul: ({ node, children, ...props }) => (
            <ul className="list-disc pl-8 mb-4" {...props}>
              {children}
            </ul>
          ),

          // 순서 있는 리스트 - GitHub 스타일
          ol: ({ node, children, ...props }) => (
            <ol className="list-decimal pl-8 mb-4" {...props}>
              {children}
            </ol>
          ),

          // 강조 - GitHub 스타일
          strong: ({ node, children, ...props }) => (
            <strong className="font-semibold" {...props}>
              {children}
            </strong>
          ),

          // 기울임 - GitHub 스타일
          em: ({ node, children, ...props }) => (
            <em className="italic" {...props}>
              {children}
            </em>
          ),

          // 취소선 - GitHub 스타일 (GFM)
          del: ({ node, children, ...props }) => (
            <del className="line-through" {...props}>
              {children}
            </del>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}