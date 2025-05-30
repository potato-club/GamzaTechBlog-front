export default function PostMeta({
  author,
  date,
  tags = []
}: {
  author: string;
  date: string;
  tags?: string[];
}) {
  return (
    <div className="flex flex-col gap-2 mt-7 text-sm text-gray-500">
      <div className="flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 text-[#798191]">
          <span className="w-6 h-6 rounded-full bg-gray-200 inline-block" />
          {author}
        </span>
        <span>|</span>
        <span className="text-[#B5BBC7]">{date}</span>

        {tags.slice(0, 2).map((tag, idx) => (
          <span
            key={idx}
            className="bg-[#F2F4F6] rounded-2xl px-3 py-1.5 text-[#848484]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}