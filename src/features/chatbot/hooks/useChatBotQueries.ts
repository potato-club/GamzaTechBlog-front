/**
 * TanStack Query를 사용한 챗봇 관련 API 훅들
 *
 * 챗봇 메시지 전송 등의 기능을 TanStack Query로 구현하여
 * 효율적인 상태 관리와 UI 업데이트를 제공합니다.
 */

import { useMutation } from "@tanstack/react-query";
import { chatBotService } from "../services";

/**
 * 챗봇에게 메시지를 전송하는 뮤테이션 훅
 *
 * @returns 메시지 전송을 위한 뮤테이션 객체
 *
 * @example
 * ```tsx
 * const sendMessageMutation = useSendMessageMutation();
 *
 * const handleSendMessage = () => {
 *   sendMessageMutation.mutate("안녕하세요!", {
 *     onSuccess: (response) => {
 *       console.log("봇 응답:", response.content);
 *     },
 *     onError: (error) => {
 *       console.error("메시지 전송 실패:", error);
 *     }
 *   });
 * };
 * ```
 */
export const useSendMessageMutation = () => {
  return useMutation({
    mutationFn: chatBotService.sendMessage,
    onError: (error) => {
      console.error("챗봇 메시지 전송 실패:", error);
    },
  });
};
