import { TextContentProps } from "../../types";

const TextContent = ({ content }: TextContentProps) => (
  <>
    {content.split("\n").map((line, index) => (
      <div key={index} className="text-gray-900">
        {line}
      </div>
    ))}
  </>
);

export default TextContent;
