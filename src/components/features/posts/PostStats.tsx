"use client";

import { useState } from "react";

interface PostStatsProps {
  postId: number;
  initialLikesCount: number;
  initialIsLiked?: boolean;
  commentsCount: number;
}

export default function PostStats({ postId, initialLikesCount, initialIsLiked = false, commentsCount }: PostStatsProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  const handleLikeClick = () => {
    // TODO: 실제 API 호출 로직 추가
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="flex items-center gap-6 mt-20">
      {/* 좋아요 버튼 */}
      <button type="button" className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={handleLikeClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
          <path
            d="M8.29 3.55496C6.67 -0.247531 1 0.157469 1 5.01749C1 9.87752 8.29 13.9276 8.29 13.9276C8.29 13.9276 15.58 9.87752 15.58 5.01749C15.58 0.157469 9.91 -0.247531 8.29 3.55496Z"
            stroke="#FF5E5E"
            strokeWidth="1.62"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={isLiked ? "#FF5E5E" : "none"}
            className="transition-all duration-200"
          />
        </svg>
        <span className="text-sm text-gray-600">좋아요 {likesCount}</span>
      </button>

      {/* 댓글 개수 */}
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
          <path d="M3.68576 13.8955L4.92017 12.9079L4.92925 12.901C5.18659 12.6951 5.31645 12.5912 5.46134 12.5172C5.59132 12.4508 5.72993 12.4024 5.87292 12.3731C6.03409 12.34 6.20197 12.34 6.53896 12.34H13.5706C14.4761 12.34 14.9294 12.34 15.2756 12.1636C15.5804 12.0083 15.8284 11.7602 15.9837 11.4554C16.1601 11.1092 16.1601 10.6564 16.1601 9.7509V3.5895C16.1601 2.68399 16.1601 2.23055 15.9837 1.88436C15.8284 1.57953 15.5799 1.33188 15.2751 1.17657C14.9285 1 14.4755 1 13.5682 1H4.17224C3.26495 1 2.81097 1 2.46443 1.17657C2.15961 1.33188 1.91196 1.57953 1.75665 1.88436C1.58008 2.23089 1.58008 2.68487 1.58008 3.59216V12.8837C1.58008 13.7469 1.58008 14.1784 1.75703 14.4001C1.91092 14.5929 2.14419 14.705 2.39087 14.7048C2.67451 14.7045 3.0117 14.4347 3.68576 13.8955Z" stroke="#353841" stroke-width="1.62" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span className="text-sm text-gray-600">댓글 {commentsCount}</span>
      </div>
    </div>
  );
}
