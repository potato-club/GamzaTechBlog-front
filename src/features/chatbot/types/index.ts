/**
 * 챗봇 기능 관련 타입 정의
 *
 * 챗봇 메시지, 상태 등과 관련된 타입들을 정의합니다.
 */

/**
 * 채팅 메시지 인터페이스
 */
export interface Message {
  /** 메시지 고유 ID */
  id: string;
  /** 메시지 내용 */
  content: string;
  /** 봇 메시지 여부 (true: 봇, false: 사용자) */
  isBot: boolean;
  /** 메시지 생성 시간 */
  timestamp: Date;
}

/**
 * 챗봇 윈도우 Props
 */
export interface ChatBotWindowProps {
  /** 챗봇 윈도우 열림 상태 */
  isOpen: boolean;
}

/**
 * 챗봇 토글 버튼 Props
 */
export interface ChatBotToggleProps {
  /** 챗봇 윈도우 열림 상태 */
  isOpen: boolean;
  /** 토글 핸들러 */
  onToggle: () => void;
}

/**
 * 챗봇 컴포넌트 Props 타입들
 */

/**
 * TextContent 컴포넌트 Props
 */
export interface TextContentProps {
  content: string;
}

/**
 * BotMessage 컴포넌트 Props
 */
export interface BotMessageProps {
  content: string;
  isPendingContent?: boolean;
}

/**
 * UserMessage 컴포넌트 Props
 */
export interface UserMessageProps {
  content: string;
}

/**
 * MessageInput 컴포넌트 Props
 */
export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  disabled: boolean;
}

/**
 * MessageList 컴포넌트 Props
 */
export interface MessageListProps {
  messages: Message[];
  isPending: boolean;
}
