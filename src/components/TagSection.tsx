import TagBadge from './TagBadge';

interface TagSectionProps {
  tags: string[];
}

export default function TagSection({ tags }: TagSectionProps) {
  return (
    <section className="mt-20">
      <h3 className="text-[18px] text-[#838C9D]">Tags</h3>
      <nav className="mt-7 flex flex-wrap gap-2 text-[14px]">
        {tags.map((tag, idx) => (
          <TagBadge key={idx} tag={tag} variant="outline" />
        ))}
      </nav>
    </section>
  );
}