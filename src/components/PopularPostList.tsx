import PopularPost from './PopularPost';

interface Post {
  id: number;
  title: string;
  author: string;
}

interface PopularPostListProps {
  posts: Post[];
}

export default function PopularPostList({ posts }: PopularPostListProps) {
  return (
    <section>
      <h3 className="text-[18px] text-[#838C9D]">인기 게시물</h3>
      {posts.map((post) => (
        <PopularPost key={post.id} title={post.title} author={post.author} />
      ))}
    </section>
  );
}