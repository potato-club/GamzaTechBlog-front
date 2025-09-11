"use client";

import { Input } from "@/components/ui/input";
import { UI_CONSTANTS } from "@/constants/ui";
import Image from "next/image";
import React, { useCallback } from "react";

interface PostTagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  currentTag: string;
  onCurrentTagChange: (tag: string) => void;
}

export default function PostTagManager({
  tags,
  onTagsChange,
  currentTag,
  onCurrentTagChange,
}: PostTagManagerProps) {
  const handleAddTag = useCallback(() => {
    const tagWithoutHash = currentTag.startsWith("#") ? currentTag.slice(1) : currentTag;
    const trimmedTag = tagWithoutHash.trim();

    if (trimmedTag !== "" && tags.length < UI_CONSTANTS.BLOG.MAX_TAGS) {
      const capitalizedTag = trimmedTag.charAt(0).toUpperCase() + trimmedTag.slice(1).toLowerCase();
      const newTag = `${capitalizedTag}`;

      if (!tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
    }
    if (tags.length < UI_CONSTANTS.BLOG.MAX_TAGS) {
      onCurrentTagChange("");
    }
  }, [currentTag, tags, onTagsChange, onCurrentTagChange]);

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      onTagsChange(tags.filter((tag) => tag !== tagToRemove));
    },
    [tags, onTagsChange]
  );

  const handleTagInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onCurrentTagChange(e.target.value);
    },
    [onCurrentTagChange]
  );

  const handleTagInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag]
  );

  return (
    <div className="flex flex-wrap gap-2 text-[14px]">
      {tags.map((tag, idx) => (
        <div
          key={tag}
          className="flex w-fit items-center gap-1 rounded-2xl bg-[#F2F4F6] px-2 py-1.5 text-[#848484]"
        >
          <span># {tag}</span>
          <Image
            src="/tagDeleteBtn.svg"
            alt={UI_CONSTANTS.ACCESSIBILITY.TAG_DELETE_ALT}
            className="cursor-pointer hover:opacity-70"
            width={10}
            height={10}
            onClick={() => handleRemoveTag(tag)}
          />
        </div>
      ))}
      <Input
        type="text"
        placeholder={UI_CONSTANTS.FORMS.PLACEHOLDERS.TAG}
        value={currentTag}
        onChange={handleTagInputChange}
        onKeyDown={handleTagInputKeyDown}
        disabled={tags.length >= UI_CONSTANTS.BLOG.MAX_TAGS}
        className="h-auto w-auto flex-grow border-0 bg-transparent p-1.5 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
