/**
 * 텍스트에서 키워드를 하이라이트하는 유틸리티 함수
 */

import React from 'react';

/**
 * 텍스트에서 키워드와 일치하는 부분을 하이라이트 처리
 * @param text - 원본 텍스트
 * @param keyword - 검색 키워드
 * @param highlightColor - 하이라이트 색상 (기본값: #FAA631)
 * @returns JSX 요소 배열
 */
export function highlightText(
  text: string,
  keyword: string,
  highlightColor: string = '#FAA631'
): React.ReactNode[] {
  if (!keyword || !text) {
    return [text];
  }

  // 대소문자 구분 없이 검색
  const regex = new RegExp(`(${keyword})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    // 키워드와 일치하는 부분인지 확인
    const isMatch = regex.test(part);

    if (isMatch) {
      return (
        <span
          key={index}
          style={{ color: highlightColor, fontWeight: 'bold' }}
        >
          {part}
        </span>
      );
    }

    return part;
  });
}

/**
 * 검색 컨텍스트에서 사용할 하이라이트 함수
 * @param text - 원본 텍스트
 * @param keyword - 검색 키워드
 * @returns JSX 요소 배열
 */
export function highlightSearchKeyword(text: string, keyword: string): React.ReactNode[] {
  return highlightText(text, keyword, '#FAA631');
}
