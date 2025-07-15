import { marked } from 'marked';

/**
 * 마크다운 텍스트를 순수 텍스트로 변환하는 유틸리티 함수
 * 
 * @param markdown - 변환할 마크다운 텍스트
 * @param maxLength - 최대 길이 (기본값: 150)
 * @returns 변환된 순수 텍스트
 */
export function markdownToText(markdown: string, maxLength: number = 150): string {
  if (!markdown) return '';

  try {
    // marked를 사용하여 마크다운을 HTML로 변환
    const html = marked(markdown, {
      breaks: true,
      gfm: true
    }) as string;

    // HTML 태그 제거하여 순수 텍스트 추출
    const textContent = html
      .replace(/<[^>]*>/g, '') // HTML 태그 제거
      .replace(/&nbsp;/g, ' ') // HTML 엔티티 변환
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // 연속된 공백 정리
      .trim();

    // 최대 길이로 자르기
    if (textContent.length > maxLength) {
      return textContent.substring(0, maxLength) + '...';
    }

    return textContent;
  } catch (error) {
    console.error('마크다운 변환 중 오류:', error);
    // 변환 실패 시 원본 텍스트에서 기본적인 마크다운 문법만 제거
    return markdown
      .replace(/[#*`~_\[\]()]/g, '') // 기본 마크다운 문법 제거
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, maxLength) + (markdown.length > maxLength ? '...' : '');
  }
}
