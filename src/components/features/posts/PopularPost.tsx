"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface PopularPostProps {
  postId: number;
  title: string;
  author: string;
  profileImage?: string;
}

export default function PopularPost({ postId, title, author, profileImage }: PopularPostProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/posts/${postId}`);
  };

  return (
    <article
      onClick={handleClick}
      className="-m-2 mb-7 cursor-pointer rounded-md border border-transparent p-2 transition-colors hover:border-[#FAA631]"
    >
      <h4 className="font-medium">{title}</h4>
      <div className="mt-4 flex items-center gap-1 text-[12px] text-[#798191]">
        {profileImage ? (
          <Image
            src={profileImage}
            alt={author}
            width={24}
            height={24}
            className="mr-1 rounded-full"
            quality={60}
            loading="lazy"
            unoptimized={profileImage.includes(".svg")}
          />
        ) : (
          <span className="inline-block h-6 w-6 rounded-full bg-gray-200" />
        )}
        {author}
      </div>
    </article>
  );
}
