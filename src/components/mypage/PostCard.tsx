import PostMeta from "./PostMeta";

export default function PostCard({
  post,
  highlighted = false,
}: {
  post: any;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-6 p-6 bg-white rounded-lg ${highlighted ? "border-2 border-blue-400" : "border border-gray-200"
        }`}
    >
      {/* 썸네일 자리 */}
      <div className="w-28 h-20 bg-gray-100 rounded-md shrink-0" />
      <div className="flex-1">
        <h2 className={`text-xl font-bold ${highlighted ? "text-blue-700" : ""}`}>
          {post.title}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{post.summary}</p>
        <PostMeta authors={post.authors} date={post.date} />
      </div>
    </div>
  );
}