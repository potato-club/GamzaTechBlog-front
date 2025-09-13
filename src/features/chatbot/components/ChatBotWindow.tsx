"use client";

import { useEffect, useRef, useState } from "react";
import { useSendMessageMutation } from "../hooks";
import { ChatBotWindowProps, Message } from "../types";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

export default function ChatBotWindow({ isOpen }: ChatBotWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "안녕하세요!\n감자 챗봇에 오신걸 환영합니다.\n(새로고침 혹은 창을 닫으면\n모든 대화 내용이 삭제됩니다.)",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const sendMessageMutation = useSendMessageMutation(setMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 새로운 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || sendMessageMutation.isPending) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");

    sendMessageMutation.mutate(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const baseWindowClass =
    "fixed right-6 bottom-[100px] z-[9998] flex h-[56.29vh] max-h-[900px] min-h-[600px] w-[23.45vw] max-w-[600px] min-w-[400px] flex-col rounded-3xl bg-white shadow-[0_0_24px_9px_rgba(33,37,40,0.06)] transition-all duration-300 ease-in-out";

  return (
    <div
      className={`${baseWindowClass} ${
        isOpen
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-4 scale-95 opacity-0"
      }`}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-center rounded-t-lg border-b border-gray-100 p-4">
        <h3 className="text-xl font-semibold text-gray-800">감자봇</h3>
      </div>

      {/* 채팅 메시지 영역 */}
      <MessageList
        messages={messages}
        isPending={sendMessageMutation.isPending}
        ref={messagesEndRef}
      />

      {/* 입력 영역 */}
      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        onKeyDown={handleKeyPress}
        disabled={sendMessageMutation.isPending}
        ref={inputRef}
      />
    </div>
  );
}
