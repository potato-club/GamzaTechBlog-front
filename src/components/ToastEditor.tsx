"use client";

import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor"; // ✅
import { useRef } from "react";

export default function ToastEditor() {
  const editorRef = useRef<Editor>(null);

  const handleSave = () => {
    const markdown = editorRef.current?.getInstance().getMarkdown();
    console.log("저장된 마크다운:", markdown);
  };

  return (
    <div>
      <Editor
        ref={editorRef}
        previewStyle="vertical" // 또는 "tab"
        height="500px"
        initialEditType="markdown" // 또는 "wysiwyg"
        useCommandShortcut={true}
      />
      <button onClick={handleSave} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        저장
      </button>
    </div>
  );
}
