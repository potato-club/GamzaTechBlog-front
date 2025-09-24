import Image from "next/image";
import Link from "next/link";

interface PopularPostProps {
  postId: number;
  title: string;
  author: string;
  profileImage?: string;
}

export default function PopularPost({ postId, title, author, profileImage }: PopularPostProps) {
  return (
    <article className="-m-2 mb-7 cursor-pointer rounded-md border border-transparent p-2">
      <Link href={`/posts/${postId}`}>
        <h4 className="font-medium transition-colors hover:text-[#FAA631]">{title}</h4>
      </Link>
      <div className="mt-4 flex items-center gap-1 text-[12px] text-[#798191]">
        {profileImage ? (
          <Image
            src={profileImage}
            alt={author}
            width={24}
            height={24}
            className="mr-1 h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <span className="inline-block h-6 w-6 rounded-full bg-gray-200" />
        )}
        <Link href={`/profile/${author}`} className="hover:text-[#FAA631]">
          {author}
        </Link>
      </div>
    </article>
  );
}
