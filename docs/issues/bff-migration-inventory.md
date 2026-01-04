# BFF 마이그레이션 인벤토리

이 문서는 현재 API 호출 경로를 P0~P4로 분류한 인벤토리입니다.  
마이그레이션 진행 중에 실제 전환 여부를 기록하는 용도로 사용합니다.

## P0 (인증/세션)

- 로그인: `src/features/auth/services/authService.ts` → `fetch("/api/auth/login")`
- 로그아웃: `src/features/auth/services/authService.ts` → `fetch("/api/auth/logout")`
- 토큰 재발급: `src/lib/apiClient.ts` → `refreshAccessToken()` (`/api/auth/reissue`)

## P1 (쓰기/변경)

### 게시글
- 생성: `src/features/posts/services/postService.ts` → `apiClient.publishPost`
- 수정: `src/features/posts/services/postService.ts` → `apiClient.revisePost`
- 삭제: `src/features/posts/services/postService.ts` → `apiClient.removePost`

### 댓글
- 생성: `src/features/comments/services/commentService.ts` → `apiClient.addComment`
- 삭제: `src/features/comments/services/commentService.ts` → `apiClient.deleteComment`

### 좋아요
- 추가: `src/features/posts/services/likeService.ts` → `apiClient.likePost`
- 취소: `src/features/posts/services/likeService.ts` → `apiClient.unlikePost`

### 이미지 업로드
- 업로드: `src/features/posts/services/imageService.ts` → `apiClient.uploadImage`

### 소개글
- 생성: `src/features/intro/services/introService.ts` → `apiClient.createIntro`
- 삭제: `src/features/intro/services/introService.ts` → `apiClient.deleteIntro`

### 사용자
- 프로필 수정: `src/features/user/services/userService.ts` → `apiClient.updateProfile`
- 프로필 이미지 수정: `src/features/user/services/userService.ts` → `apiClient.updateProfileImage`
- 회원가입 중 프로필 업데이트: `src/features/user/services/userService.ts` → `apiClient.completeProfile`
- 계정 탈퇴: `src/features/user/services/userService.ts` → `apiClient.withdraw`

### 관리자
- 승인/관리: `src/features/admin/services/adminService.ts` → `apiClient.approveUserProfile`

## P2 (개인화 읽기)

- 프로필: `src/features/user/services/userService.ts` → `apiClient.getCurrentUserProfile`
- 역할: `src/features/user/services/userService.ts` → `apiClient.getCurrentUserRole`
- 활동 통계: `src/features/user/services/userService.ts` → `apiClient.getActivitySummary`
- 내 게시글: `src/features/posts/services/postService.ts` → `apiClient.getMyPosts`
- 내 댓글: `src/features/comments/services/commentService.ts` → `apiClient.getMyComments`
- 내 좋아요: `src/features/posts/services/postService.ts` → `apiClient.getMyLikes`
- 좋아요 상태: `src/features/posts/services/likeService.ts` → `apiClient.isPostLiked`

## P3 (관리자 읽기)

- 대기 사용자 목록: `src/features/admin/services/adminService.ts` → `apiClient.getPendingUsers`

## P4 (공개 읽기)

- 게시글 목록: `src/features/posts/services/postService.ts` → `apiClient.getPosts`
- 태그별 목록: `src/features/posts/services/postService.ts` → `apiClient.getPostsByTag`
- 게시글 상세: `src/features/posts/services/postService.ts` → `apiClient.getPostDetail`
- 태그 목록: `src/features/posts/services/postService.ts` → `apiClient.getAllTags`
- 인기글: `src/features/posts/services/postService.ts` → `apiClient.getWeeklyPopularPosts`
- 검색: `src/features/posts/services/postService.ts` → `apiClient.searchPosts`
- 홈 피드: `src/features/posts/services/postService.ts` → `apiClient.getHomeFeed`
- 사이드바 데이터: `src/features/posts/services/postService.ts` → `apiClient.getWeeklyPopularPosts`, `apiClient.getAllTags`
- 공개 소개: `src/features/intro/services/introService.ts` → `apiClient.getIntroList`
- 공개 프로필: `src/features/user/services/userService.ts` → `apiClient.getPublicProfileByNickname`
- 챗봇 메시지: `src/features/chatbot/services/chatBotService.ts` → `apiClient.chat`
