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
      className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-2 rounded-md -m-2 mb-7"
    >
      <h4 className="font-medium">{title}</h4>
      <div className="flex items-center gap-1 text-[#798191] text-[12px] mt-4">
        {profileImage ? (
          <Image src={profileImage} alt={author} width={24} height={24} className="rounded-full mr-1" />
        ) : (
          <span className="w-6 h-6 rounded-full bg-gray-200 inline-block" />
        )}
        {author}
      </div>
    </article>
  );
}