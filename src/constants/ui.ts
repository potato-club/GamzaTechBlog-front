export const UI_CONSTANTS = {
  BLOG: {
    DESCRIPTIONS: [
      "감자에서 시작되는 진짜 개발 이야기",
      "뿌리부터 단단한 기술과 인사이트",
      "우리 코드는 감자처럼 생겼지만 돌아갑니다",
      "우리 얼굴은 감자처럼 생겼지만 돌아갑니다",
    ] as const,
    MAX_TAGS: 2,
    MAX_TITLE_LENGTH: 100,
  },
  FORMS: {
    VALIDATION_MESSAGES: {
      REQUIRED_TITLE: "제목은 필수입니다.",
      TITLE_TOO_LONG: "제목은 100자 이내로 입력해주세요.",
      REQUIRED_CONTENT: "내용을 입력해주세요.",
      REQUIRED_LOGIN: "로그인이 필요합니다.",
      REQUIRED_COMMENT: "댓글 내용을 입력해주세요.",
    } as const,
    PLACEHOLDERS: {
      TITLE: "제목을 입력해주세요.",
      COMMENT: "댓글을 남겨주세요.",
      TAG: "태그 입력 후 Enter (최대 2개)",
    } as const,
    BUTTONS: {
      SUBMIT: "완료",
      EDIT_SUBMIT: "수정 완료",
      LOADING_CREATE: "게시글 업로드 중",
      LOADING_EDIT: "게시글 수정 중",
      COMMENT_SUBMIT: "등록",
      COMMENT_LOADING: "등록 중...",
    } as const,
  },
  ACCESSIBILITY: {
    SKIP_TO_MAIN: "메인 콘텐츠로 바로 이동",
    PROFILE_IMAGE_ALT: (name: string) => `${name}의 프로필 이미지`,
    CURRENT_USER_PROFILE_ALT: "현재 사용자의 프로필 이미지",
    TAG_DELETE_ALT: "태그 삭제 버튼",
  } as const,
  ACTIONS: {
    POST: {
      EDIT: "수정",
      DELETE: "삭제",
      EDIT_ARIA_LABEL: "게시글 수정하기",
      DELETE_ARIA_LABEL: "게시글 삭제하기",
    } as const,
  } as const,
} as const;

// 타입 추출
export type BlogDescription = (typeof UI_CONSTANTS.BLOG.DESCRIPTIONS)[number];
export type ValidationMessage =
  (typeof UI_CONSTANTS.FORMS.VALIDATION_MESSAGES)[keyof typeof UI_CONSTANTS.FORMS.VALIDATION_MESSAGES];
export type FormPlaceholder =
  (typeof UI_CONSTANTS.FORMS.PLACEHOLDERS)[keyof typeof UI_CONSTANTS.FORMS.PLACEHOLDERS];
