import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownViewer({ content }: { content: string; }) {
  return (
    <div className="prose prose-slate prose-lg max-w-none 
                    [&_ul]:list-disc [&_ol]:list-decimal 
                    [&_ul]:ml-6 [&_ol]:ml-6 
                    [&_li]:mb-2 my-6 text-[17px] text-[#474F5D] leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}