/**
 * 챗봇 관련 API 서비스
 *
 * 챗봇과의 통신을 담당하는 서비스 레이어입니다.
 * apiClient를 사용하여 API 호출만을 담당합니다.
 */

import { ChatMessageRequest, ChatMessageResponse } from "@/generated/api";
import { apiClient } from "@/lib/apiClient";

export const chatBotService = {
  /**
   * 챗봇에게 메시지를 전송하고 응답을 받습니다
   *
   * @param message - 전송할 메시지 내용
   * @returns 챗봇의 응답 메시지
   * @throws API 호출 실패 시 에러
   */
  async sendMessage(message: string): Promise<ChatMessageResponse> {
    const chatRequest: ChatMessageRequest = {
      message,
    };

    const response = await apiClient.chat({
      chatMessageRequest: chatRequest,
    });

    return response;
  },
};
