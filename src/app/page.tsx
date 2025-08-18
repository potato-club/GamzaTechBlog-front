import MainPageContent from "@/components/MainPageContent";
import WelcomeModal from "@/components/features/main/WelcomeModal";

export default async function Home() {
  return (
    <>
      <WelcomeModal />
      <MainPageContent />
    </>
  );
}
