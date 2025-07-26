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
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}