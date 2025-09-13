"use client";

import { useState } from "react";
import ChatBotToggle from "./ChatBotToggle";
import ChatBotWindow from "./ChatBotWindow";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ChatBotWindow isOpen={isOpen} />
      <ChatBotToggle isOpen={isOpen} onToggle={handleToggle} />
    </>
  );
}
