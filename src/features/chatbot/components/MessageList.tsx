"use client";

import { forwardRef, useEffect, useState } from "react";
import { MessageListProps } from "../types";
import { BotMessage, UserMessage } from "./messages";

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(({ messages, isPending }, ref) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }));
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-4">
        <div className="mb-4 text-center text-sm text-gray-500">{currentTime}</div>

        {messages.map((message) => (
          <div key={message.id}>
            {message.isBot ? (
              <BotMessage content={message.content} />
            ) : (
              <UserMessage content={message.content} />
            )}
          </div>
        ))}

        {isPending && <BotMessage content="" isPendingContent={true} />}

        {/* 스크롤을 위한 빈 div */}
        <div ref={ref} />
      </div>
    </div>
  );
});

MessageList.displayName = "MessageList";

export default MessageList;
