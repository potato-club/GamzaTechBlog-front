import { ChatMessageRequest, ChatMessageResponse } from "@/generated/api";

export const chatBotService = {
  async sendMessage(message: string): Promise<ChatMessageResponse> {
    const chatRequest: ChatMessageRequest = { message };

    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chatRequest),
    });

    if (!response.ok) {
      throw new Error(`Failed to send chat message (status ${response.status}).`);
    }

    return (await response.json()) as ChatMessageResponse;
  },
};
