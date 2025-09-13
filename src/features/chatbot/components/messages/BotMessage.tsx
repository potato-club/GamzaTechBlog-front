"use client";

import Image from "next/image";
import { BotMessageProps } from "../../types";
import SkeletonContent from "./SkeletonContent";
import TextContent from "./TextContent";

// 봇 메시지 내용 렌더링 함수
const renderBotMessageContent = (content: string, isPending: boolean) => {
  if (isPending) return <SkeletonContent />;
  return <TextContent content={content} />;
};

const BotMessage = ({ content, isPendingContent = false }: BotMessageProps) => (
  <div className="mb-4 flex items-start gap-3">
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black">
      <Image src="/chatBot.svg" alt="챗봇" width={24} height={24} className="object-contain" />
    </div>
    <div className="max-w-[400px] rounded-r-2xl rounded-bl-2xl bg-gray-100 px-4 py-2 font-medium">
      {renderBotMessageContent(content, isPendingContent)}
    </div>
  </div>
);

export default BotMessage;
