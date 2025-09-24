/**
 * TanStack Query를 사용한 챗봇 관련 API 훅들
 *
 * 챗봇 메시지 전송 등의 기능을 TanStack Query로 구현하여
 * 효율적인 상태 관리와 UI 업데이트를 제공합니다.
 */

import { useMutation } from "@tanstack/react-query";
import { chatBotService } from "../services";
import { Message } from "../types";

/**
 * 챗봇에게 메시지를 전송하는 뮤테이션 훅
 * 성공/실패 시 메시지 상태 업데이트 로직 포함
 *
 * @param setMessages - 메시지 상태 업데이트 함수
 * @returns 메시지 전송을 위한 뮤테이션 객체
 */
export const useSendMessageMutation = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  return useMutation({
    mutationFn: chatBotService.sendMessage,
    onSuccess: (response) => {
      const botMessage: Message = {
        id: crypto.randomUUID(),
        content: response.content || "죄송합니다. 응답을 받을 수 없습니다.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    },
    onError: (err) => {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("챗봇 메시지 전송 실패", err);
    },
  });
};
