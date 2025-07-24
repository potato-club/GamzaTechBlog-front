import Image from 'next/image';

export default function PostMeta({
  author,
  profileImage,
  date,
  tags = []
}: {
  author: string;
  profileImage: string;
  date: string;
  tags?: string[];
}) {
  return (
    <div className="flex flex-col gap-2 mt-7 text-sm text-gray-500">
      <div className="flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 text-[#798191]">
          <div className="w-6 h-6 rounded-full overflow-hidden mr-1">
            <Image
              src={profileImage}
              alt={`${author}의 프로필 이미지`}
              width={24}
              height={24}
              className="w-full h-full object-cover"
            />
          </div>
          {author}
        </span>
        <span>|</span>
        <span className="text-[#B5BBC7]">{date}</span>

        {tags.slice(0, 2).map((tag, idx) => (
          <span
            key={idx}
            className="bg-[#F2F4F6] rounded-2xl px-3 py-1.5 text-[#848484]"
          >
            # {tag}
          </span>
        ))}
      </div>
    </div>
  );
}