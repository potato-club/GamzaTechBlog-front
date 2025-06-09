import PopularPostList from './PopularPostList';
import TagSection from './TagSection';

interface Post {
  id: number;
  title: string;
  author: string;
}

interface SidebarProps {
  posts: Post[];
  tags: string[];
}

export default function Sidebar({ posts, tags }: SidebarProps) {
  return (
    <aside className="flex-1 ml-10 border-l border-[#D5D9E3] pl-10">
      <PopularPostList posts={posts} />
      <TagSection tags={tags} />
    </aside>
  );
}