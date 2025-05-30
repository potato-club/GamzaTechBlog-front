import PostMeta from "./PostMeta";

export default function PostCard({
  post,
}: {
  post: any;
}) {
  return (
    <div
      className={`flex items-center gap-6 py-6 bg-white rounded-lg`}
    >
      {/* 썸네일 자리 */}
      <div className="flex-1 w-[500px] h-[140px]">
        <h2 className={`text-xl font-bold truncate`}>
          {post.title}
        </h2>
        <p className="text-[#B5BBC7] text-sm mt-3.5 truncate">{post.summary}</p>
        <PostMeta author={post.author} date={post.date} tags={post.tags} />
      </div>
      <div className="w-44 h-28 bg-gray-100 rounded-2xl shrink-0" />
    </div>
  );
}