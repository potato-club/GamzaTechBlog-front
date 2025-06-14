interface PopularPostProps {
  title: string;
  author: string;
}

export default function PopularPost({ title, author }: PopularPostProps) {
  return (
    <article>
      <h4 className="mt-7 font-medium">{title}</h4>
      <div className="flex items-center gap-1 text-[#798191] text-[12px] mt-4">
        <span className="w-6 h-6 rounded-full bg-gray-200 inline-block" />
        {author}
      </div>
    </article>
  );
}