import { UserMessageProps } from "../../types";

const UserMessage = ({ content }: UserMessageProps) => (
  <div className="mb-4 flex justify-end">
    <div className="max-w-[400px] rounded-l-2xl rounded-br-2xl bg-black px-4 py-2 font-medium text-white">
      {content}
    </div>
  </div>
);

export default UserMessage;
