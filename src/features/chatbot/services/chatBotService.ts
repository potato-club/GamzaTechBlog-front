import { ChatMessageRequest, ChatMessageResponse } from "@/generated/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const chatBotService = {
  async sendMessage(message: string): Promise<ChatMessageResponse> {
    const chatRequest: ChatMessageRequest = { message };

    const token = document.cookie.match(/(?:^|;\s*)authorization=([^;]*)/)?.[1];

    const response = await fetch(`${API_BASE_URL}/api/v1/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(chatRequest),
    });

    if (!response.ok) {
      throw new Error(`Failed to send chat message (status ${response.status}).`);
    }

    return (await response.json()) as ChatMessageResponse;
  },
};
