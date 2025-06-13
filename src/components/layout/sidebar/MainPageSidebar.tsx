import PopularPostList from '../../features/posts/PopularPostList';
import TagSection from "../../TagSection";


export default function MainPageSidebar({ posts, tags }: { posts: any[]; tags: any[]; }) {
  return (
    <aside className="flex-1 ml-10 border-l border-[#D5D9E3] pl-10">
      <PopularPostList posts={posts} />
      <TagSection tags={tags} />
    </aside>
  );
}