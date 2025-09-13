"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { Message } from "../types";

interface MessageListProps {
  messages: Message[];
  isPending: boolean;
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(({ messages, isPending }, ref) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-4">
        <div className="mb-4 text-center text-sm text-gray-500">
          {new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.isBot ? "flex items-start gap-3" : "flex justify-end"}`}
          >
            {message.isBot ? (
              <>
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black">
                  <Image
                    src="/chatBot.svg"
                    alt="챗봇"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <div className="max-w-[400px] rounded-r-2xl rounded-bl-2xl bg-gray-100 px-4 py-2 font-medium">
                  {message.content.split("\n").map((line, index) => (
                    <div key={index} className="text-gray-900">
                      {line}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="max-w-[400px] rounded-l-2xl rounded-br-2xl bg-black px-4 py-2 font-medium text-white">
                {message.content}
              </div>
            )}
          </div>
        ))}

        {isPending && (
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black">
              <Image
                src="/chatBot.svg"
                alt="챗봇"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <div className="max-w-[400px] rounded-lg bg-gray-100 px-4 py-2 font-medium">
              <div className="space-y-2">
                <div className="h-4 w-[200px] animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-[200px] animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-[200px] animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        )}

        {/* 스크롤을 위한 빈 div */}
        <div ref={ref} />
      </div>
    </div>
  );
});

MessageList.displayName = "MessageList";

export default MessageList;
