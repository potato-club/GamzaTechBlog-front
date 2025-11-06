import InteractivePostList from "./InteractivePostList";

interface PostListSectionProps {
  initialTag?: string;
  initialPage: number;
}

export default function PostListSection({ initialTag }: PostListSectionProps) {
  return (
    <section className="flex-1 md:flex-3">
      {initialTag && (
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h2 className="text-xl font-semibold md:text-2xl">#{initialTag} 태그 게시글</h2>
        </div>
      )}

      <InteractivePostList />
    </section>
  );
}
