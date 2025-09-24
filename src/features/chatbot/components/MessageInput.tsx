"use client";

import { forwardRef } from "react";
import { MessageInputProps } from "../types";

const MessageInput = forwardRef<HTMLInputElement, MessageInputProps>(
  ({ value, onChange, onSend, onKeyDown, disabled }, ref) => {
    return (
      <div className="p-4">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-[#F2F4F5] px-4 py-1">
          <input
            ref={ref}
            type="text"
            placeholder="메시지를 입력해주세요."
            className="flex-1 bg-transparent outline-none placeholder:font-semibold"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={disabled}
          />
          <button
            className="rounded-full p-2 text-white transition-colors"
            aria-label="메시지 전송"
            onClick={onSend}
            disabled={disabled || !value.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 36 37"
              fill="none"
            >
              <path
                d="M15.4616 21.0385L22.7309 13.7693M30.1669 9.33301L24.031 29.2749C23.4811 31.062 23.2059 31.956 22.7317 32.2524C22.3203 32.5094 21.811 32.5524 21.3629 32.3665C20.8463 32.1521 20.427 31.315 19.5905 29.642L15.7041 21.8691C15.5713 21.6037 15.5049 21.4715 15.4162 21.3564C15.3376 21.2544 15.2468 21.1624 15.1447 21.0837C15.0323 20.9971 14.9023 20.9321 14.6487 20.8053L6.85789 16.9099C5.18493 16.0734 4.34837 15.6548 4.13401 15.1382C3.9481 14.6901 3.9905 14.1803 4.24753 13.769C4.54391 13.2946 5.43785 13.019 7.22556 12.469L27.1674 6.33301C28.5729 5.90057 29.2759 5.68452 29.7506 5.8588C30.1641 6.0106 30.4901 6.33626 30.6419 6.74976C30.8161 7.22425 30.5999 7.9269 30.1679 9.33093L30.1669 9.33301Z"
                stroke="#212528"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }
);

MessageInput.displayName = "MessageInput";

export default MessageInput;
