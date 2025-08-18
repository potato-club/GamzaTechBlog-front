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
    <div className="mt-7 flex flex-col gap-2 text-sm text-gray-500">
      <div className="flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 text-[#798191]">
          <div className="mr-1 h-6 w-6 overflow-hidden rounded-full">
            <Image
              src={profileImage || "/profileSVG.svg"}
              alt={`${author}의 프로필 이미지`}
              width={24}
              height={24}
              className="h-full w-full object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
          {author}
        </span>
        <span>|</span>
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
