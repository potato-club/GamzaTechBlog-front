import IntroForm from "@/features/intro/components/IntroForm";
import IntroList from "@/features/intro/components/IntroList";
import type { IntroResponse } from "@/generated/orval/models";

interface WelcomeBoardSectionProps {
  intros: IntroResponse[];
  totalPages: number;
}

export default function WelcomeBoardSection({ intros, totalPages }: WelcomeBoardSectionProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">텃밭인사</h2>
        <p className="text-gray-600">
          감자 기술 블로그에 오신 것을 환영합니다!
          <br className="md:hidden" /> 간단한 자기소개를 남겨주세요.
        </p>
      </div>

      {/* 자기소개 작성 폼 */}
      <div className="mb-8">
        <IntroForm />
      </div>

      {/* 자기소개 목록 */}
      <IntroList intros={intros} totalPages={totalPages} />
    </div>
  );
}
