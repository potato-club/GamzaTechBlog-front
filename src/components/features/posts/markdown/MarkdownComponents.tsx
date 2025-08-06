import { Components } from "react-markdown";
import { MarkdownCode, MarkdownPre } from "./CodeComponents";
import { MarkdownInput, MarkdownLi, MarkdownOl, MarkdownUl } from "./ListComponents";
import { MarkdownMath } from "./MathComponents";
import { MarkdownImage, MarkdownLink } from "./MediaComponents";
import { MarkdownTable, MarkdownTd, MarkdownTh, MarkdownThead } from "./TableComponents";
import {
  MarkdownBlockquote,
  MarkdownDel,
  MarkdownEm,
  MarkdownH1,
  MarkdownH2,
  MarkdownH3,
  MarkdownH4,
  MarkdownH5,
  MarkdownH6,
  MarkdownHr,
  MarkdownP,
  MarkdownStrong,
} from "./TextComponents";

// 모든 마크다운 컴포넌트를 하나의 객체로 내보내기
export const markdownComponents: Components = {
  // 미디어 컴포넌트들
  img: MarkdownImage,
  a: MarkdownLink,

  // 텍스트 컴포넌트들
  h1: MarkdownH1,
  h2: MarkdownH2,
  h3: MarkdownH3,
  h4: MarkdownH4,
  h5: MarkdownH5,
  h6: MarkdownH6,
  p: MarkdownP,
  strong: MarkdownStrong,
  em: MarkdownEm,
  del: MarkdownDel,
  blockquote: MarkdownBlockquote,
  hr: MarkdownHr,

  // 코드 컴포넌트들
  pre: MarkdownPre,
  code: MarkdownCode,

  // 리스트 컴포넌트들
  ul: MarkdownUl,
  ol: MarkdownOl,
  li: MarkdownLi,
  input: MarkdownInput,

  // 테이블 컴포넌트들
  table: MarkdownTable,
  thead: MarkdownThead,
  th: MarkdownTh,
  td: MarkdownTd,

  // 수학 공식 지원을 위한 div 래퍼
  div: ({ node, className, children, ...props }: any) => {
    if (className?.includes("math")) {
      return (
        <MarkdownMath node={node} {...props}>
          {children}
        </MarkdownMath>
      );
    }
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  },
};
