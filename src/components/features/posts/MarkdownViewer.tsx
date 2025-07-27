import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { markdownComponents } from './markdown/MarkdownComponents';

// CSS imports for styling
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';

export default function MarkdownViewer({ content }: { content: string; }) {
  // highlight.js 언어 등록 (필요시)
  useEffect(() => {
    import('highlight.js/lib/common').then((hljs) => {
      // 추가 언어가 필요한 경우 여기서 등록
      // hljs.default.registerLanguage('특정언어', require('highlight.js/lib/languages/특정언어'));
    });
  }, []);

  return (
    <div className="prose prose-slate prose-lg max-w-full 
                    [&_ul]:list-disc [&_ol]:list-decimal 
                    [&_ul]:ml-6 [&_ol]:ml-6 
                    [&_li]:mb-2 my-6 text-[17px] text-[#474F5D] leading-relaxed
                    break-words overflow-wrap-anywhere
                    [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_pre]:whitespace-pre-wrap
                    [&_code]:break-words [&_code]:max-w-full
                    [&_table]:overflow-x-auto [&_table]:max-w-full
                    [&_img]:max-w-full [&_img]:h-auto
                    [&_.katex]:overflow-x-auto [&_.katex]:max-w-full">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,           // GitHub Flavored Markdown
          remarkMath,          // 수학 표기법 지원
          remarkBreaks,        // 줄바꿈을 <br>로 변환
          remarkEmoji,         // 이모지 지원 (:smile: → 😄)
        ]}
        rehypePlugins={[
          rehypeRaw,           // HTML 태그 허용
          [rehypeSanitize, {   // XSS 보안 처리
            allowDangerousHtml: true,
            attributes: {
              '*': ['className', 'style', 'id'],
              'a': ['href', 'target', 'rel'],
              'img': ['src', 'alt', 'width', 'height'],
              'code': ['className'],
              'pre': ['className'],
            },
          }],
          [rehypeHighlight, {  // 코드 문법 강조
            detect: true,
            ignoreMissing: true,
          }],
          rehypeKatex,         // 수학 공식 렌더링
        ]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}