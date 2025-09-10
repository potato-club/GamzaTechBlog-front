"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ChatBotWindow from "./ChatBotWindow";

export default function ChatBotToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ChatBotWindow isOpen={isOpen} />

      {/* 토글 버튼 */}
      <button
        onClick={handleToggle}
        className={`fixed right-6 bottom-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl ${
          isOpen ? "bg-[#F2F4F5]" : "bg-black hover:bg-gray-800"
        }`}
        aria-label={isOpen ? "챗봇 닫기" : "챗봇 열기"}
      >
        {isOpen ? (
          <X size={32} className="text-gray-600" />
        ) : (
          <Image src="/chatBot.svg" alt="챗봇" width={30} height={30} className="object-contain" />
        )}
      </button>
    </>
  );
}
