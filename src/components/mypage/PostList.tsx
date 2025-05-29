import PostCard from "./PostCard";

export default function PostList({ posts }: { posts: any[]; }) {
  return (
    <div className="flex flex-col gap-8 mt-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}