import PostCard from "./PostCard";

export default function LikeList({ likes }: { likes: any[]; }) {
  return (
    <div className="flex flex-col gap-8 mt-8">
      {likes.map((like) => (
        <PostCard key={like.id} post={like} />
      ))}
    </div>
  );
}