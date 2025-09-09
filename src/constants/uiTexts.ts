/**
 * UI에서 사용되는 모든 텍스트 상수들
 * 유지보수성과 국제화를 위해 중앙 집중 관리
 */

// 게시글 관련
export const POST_TEXTS = {
  STATUS_WRITING: "작성 중...",
  STATUS_PUBLISHED: "게시됨",
  STATUS_DRAFT: "임시저장",
  LOADING: "로딩 중...",
  NO_CONTENT: "내용이 없습니다",
  EDIT_POST: "게시글 수정",
  DELETE_POST: "게시글 삭제",
  LIKE_POST: "좋아요",
  SHARE_POST: "공유하기",
} as const;

// 댓글 관련
export const COMMENT_TEXTS = {
  LOADING: "댓글을 불러오는 중...",
  NO_COMMENTS: "댓글이 없습니다",
  WRITE_COMMENT: "댓글을 작성해주세요",
  EDIT_COMMENT: "댓글 수정",
  DELETE_COMMENT: "댓글 삭제",
  REPLY: "답글",
} as const;

// 사용자 관련
export const USER_TEXTS = {
  PROFILE_EDIT: "프로필 수정",
  PROFILE_VIEW: "프로필 보기",
  PROFILE_IMAGE: "프로필 이미지",
  EMAIL_PLACEHOLDER: "이메일을 입력하세요",
  EMAIL_NOT_SET: "이메일이 설정되지 않았습니다.",
  POSITION_PLACEHOLDER: "직군을 선택하세요",
  POSITION_NOT_SET: "직군이 설정되지 않았습니다.",
  LOGOUT: "로그아웃",
  WITHDRAW: "회원탈퇴",
} as const;

// 폼 검증 메시지
export const VALIDATION_TEXTS = {
  EMAIL_INVALID: "올바른 이메일을 입력해주세요",
  STUDENT_NUMBER_REQUIRED: "학번을 입력해주세요.",
  BATCH_INVALID: "숫자만 입력 가능합니다.",
  BATCH_POSITIVE: "기수를 올바르게 입력해주세요.",
  POSITION_REQUIRED: "직군을 선택해주세요.",
  PRIVACY_AGREE_1: "이용약관에 동의해주세요.",
  PRIVACY_AGREE_2: "개인정보 수집 및 이용에 동의해주세요.",
} as const;

// 검색 관련
export const SEARCH_TEXTS = {
  NO_RESULTS: (keyword: string) => `"${keyword}"에 대한 검색 결과가 없습니다`,
  NO_KEYWORD: "검색어를 입력해주세요",
  TRY_DIFFERENT: "다른 키워드로 검색해보세요.",
  FIND_POSTS: "원하는 게시글을 찾아보세요!",
  SEARCHING: "검색 중...",
  SEARCH_ERROR: "검색 중 오류가 발생했습니다.",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
} as const;

// 일반적인 액션
export const ACTION_TEXTS = {
  SAVE: "저장",
  CANCEL: "취소",
  CONFIRM: "확인",
  DELETE: "삭제",
  EDIT: "수정",
  COMPLETE: "완료",
  LOADING: "로딩 중...",
  ERROR: "오류가 발생했습니다",
  SUCCESS: "성공적으로 완료되었습니다",
  RETRY: "다시 시도",
} as const;

// 접근성 관련
export const A11Y_TEXTS = {
  REQUIRED_FIELD: "필수",
  SIGNUP_FORM: "회원가입 양식",
  SIGNUP_COMPLETE: "회원가입 완료",
  PROFILE_IMAGE_ALT: (name: string) => `${name}의 프로필 이미지`,
  ICON_ALT: (label: string) => `${label} 아이콘`,
  MORE_OPTIONS: "더보기",
} as const;

// 성공/실패 메시지
export const MESSAGE_TEXTS = {
  PROFILE_UPDATE_SUCCESS: "프로필이 성공적으로 업데이트되었습니다.",
  PROFILE_IMAGE_SUCCESS: "프로필 이미지가 성공적으로 업데이트되었습니다.",
  PROFILE_BOTH_SUCCESS: "프로필 이미지와 정보가 성공적으로 업데이트되었습니다.",
  NO_CHANGES: "변경된 내용이 없습니다.",
  PROFILE_UPDATE_FAILED: "프로필 업데이트에 실패했습니다. 다시 시도해주세요.",
  TOKEN_REFRESH_SUCCESS: "새 액세스 토큰 발급 및 저장 성공.",
  TOKEN_REFRESH_FAILED:
    "리프레시 토큰이 만료되었거나 유효하지 않습니다. 강제 로그아웃이 필요합니다.",
} as const;

// 자기소개 관련
export const INTRO_TEXTS = {
  DELETE_TITLE: "텃밭인사 삭제",
  WELCOME_PLACEHOLDER: "감자 기술 블로그에 오신 것을 환영합니다! 간단한 자기소개를 남겨주세요.",
} as const;

// 모든 텍스트를 하나의 객체로 통합 (선택적)
export const UI_TEXTS = {
  POST: POST_TEXTS,
  COMMENT: COMMENT_TEXTS,
  USER: USER_TEXTS,
  VALIDATION: VALIDATION_TEXTS,
  SEARCH: SEARCH_TEXTS,
  ACTION: ACTION_TEXTS,
  A11Y: A11Y_TEXTS,
  MESSAGE: MESSAGE_TEXTS,
  INTRO: INTRO_TEXTS,
} as const;

// 타입 정의 (TypeScript 지원)
export type PostTexts = typeof POST_TEXTS;
export type CommentTexts = typeof COMMENT_TEXTS;
export type UserTexts = typeof USER_TEXTS;
export type ValidationTexts = typeof VALIDATION_TEXTS;
export type SearchTexts = typeof SEARCH_TEXTS;
export type ActionTexts = typeof ACTION_TEXTS;
export type A11yTexts = typeof A11Y_TEXTS;
export type MessageTexts = typeof MESSAGE_TEXTS;
export type IntroTexts = typeof INTRO_TEXTS;
export type UITexts = typeof UI_TEXTS;
