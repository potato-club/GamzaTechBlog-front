import TagBadge from "@/components/ui/TagBadge";
import Image from "next/image";

export default function PostMeta({
  author,
  profileImage,
  date,
  tags = [],
}: {
  author: string;
  profileImage: string;
  date: string;
  tags?: string[];
}) {
  return (
    <div className="mt-4 flex flex-col gap-2 text-sm text-gray-500 md:mt-7">
      <div className="flex flex-wrap items-center gap-2 text-xs md:gap-3">
        <span className="flex items-center gap-1 text-[#798191]">
          <div className="mr-1 h-5 w-5 overflow-hidden rounded-full md:h-6 md:w-6">
            <Image
              src={profileImage || "/profileSVG.svg"}
              alt={`${author}의 프로필 이미지`}
              width={20}
              height={20}
              className="h-full w-full object-cover md:h-6 md:w-6"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
          {author}
        </span>
        <span className="hidden md:inline">|</span>
        <span className="text-[#B5BBC7]">{date}</span>

        {tags.slice(0, 2).map((tag, idx) => (
          <TagBadge
            key={idx}
            tag={tag}
            variant="gray"
            className="border-none bg-[#F2F4F6] text-[#848484]"
          />
        ))}
      </div>
    </div>
  );
}
