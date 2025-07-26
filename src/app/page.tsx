import MainPageContent from "@/components/MainPageContent";
import { TagProvider } from "@/contexts/TagContext";

export default async function Home() {
  return (
    <TagProvider>
      <MainPageContent />
    </TagProvider>
  );
}
