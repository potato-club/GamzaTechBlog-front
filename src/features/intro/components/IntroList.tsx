import PaginationWrapper from "@/components/shared/pagination/PaginationWrapper";
import type { IntroResponse } from "@/generated/orval/models";
import IntroCard from "./IntroCard";

interface IntroListProps {
  intros: IntroResponse[];
  totalPages: number;
}

export default function IntroList({ intros, totalPages }: IntroListProps) {
  return (
    <div>
      <div className="space-y-4">
        {intros.length > 0 ? (
          intros.map((intro) => <IntroCard key={intro.introId} intro={intro} />)
        ) : (
          <div className="rounded-xl bg-[#FAFBFF] p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h2m2-4h6a2 2 0 012 2v6a2 2 0 01-2 2h-6l-4 4V8a2 2 0 012-2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[#1C222E]">아직 자기소개가 없습니다</h3>
            <p className="text-[#464C58]">첫 번째 자기소개를 작성해보세요!</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <PaginationWrapper
            totalPages={totalPages}
            scrollToTop={true}
            extraParams={{ tab: "welcome" }}
          />
        </div>
      )}
    </div>
  );
}
