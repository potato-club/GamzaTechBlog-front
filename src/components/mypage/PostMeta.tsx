export default function PostMeta({
  authors,
  date,
}: {
  authors: { name: string; avatarUrl?: string; }[];
  date: string;
}) {
  return (
    <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
      {authors.map((author, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <span className="w-6 h-6 rounded-full bg-gray-200 inline-block" />
          {author.name}
        </span>
      ))}
      <span className="mx-2">|</span>
      <span>{date}</span>
    </div>
  );
}