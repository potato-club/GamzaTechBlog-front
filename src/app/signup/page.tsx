"use client";

import SignupInput from "@/components/features/auth/SignupInput";
import signupFields from "@/constants/signupFields";
import { Position } from "@/enums/position"; // ⭐️ Position enum import
import type { PositionKey, UserProfileData } from "@/types/user"; // ⭐️ UserProfileData 및 PositionKey 타입 import
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ⭐️ useRouter import
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";

// Position enum의 표시 이름 배열 (Zod 유효성 검사용)
const positionDisplayNames = Object.values(Position) as [string, ...string[]];

const schema = z.object({
  email: z.string().email("올바른 이메일을 입력해주세요").optional(),
  studentNumber: z.string().optional(),
  gamjaBatch: z.string().optional(),
  position: z.enum(positionDisplayNames).optional(), // Position enum의 표시 이름 중 하나여야 함
  privacyAgree1: z.literal(true, { message: "이용약관에 동의해주세요." }),
  privacyAgree2: z.literal(true, { message: "개인정보 수집 및 이용에 동의해주세요." }),
});

type SignupForm = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter(); // ⭐️ 라우터 초기화
  const { refetchAuthStatus } = useAuth(); // ⭐️ 인증 상태 리페치 함수 가져오기

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }, // isValid 추가
  } = useForm<SignupForm>({
    resolver: zodResolver(schema),
    defaultValues: { // 폼 기본값 설정
      email: "",
      studentNumber: "",
      gamjaBatch: undefined,
      position: undefined,
      privacyAgree1: undefined,
      privacyAgree2: undefined,
    }
  });

  const onSubmit = async (data: SignupForm) => { // ⭐️ async 추가
    let positionKey: PositionKey | undefined = undefined;
    if (data.position) {
      // 선택된 표시 이름(data.position)을 Position enum의 키로 변환
      const foundKey = (Object.keys(Position) as Array<keyof typeof Position>).find(
        key => Position[key] === data.position
      );
      positionKey = foundKey;
    }

    const payload: Partial<UserProfileData> = {
      email: data.email,
      studentNumber: data.studentNumber,
      gamjaBatch: Number(data.gamjaBatch), // Zod 스키마에서 이미 숫자로 변환됨
      position: positionKey,
    };

    // undefined 값을 가진 필드를 payload에서 제거 (선택 사항, 백엔드 요구사항에 따라 다름)
    Object.keys(payload).forEach(keyStr => {
      const key = keyStr as keyof Partial<UserProfileData>;
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    try {
      console.log("Submitting signup data:", payload);
      await userService.updateProfileInSignup(payload);
      // alert("회원 정보가 성공적으로 업데이트되었습니다. 메인 페이지로 이동합니다.");
      await refetchAuthStatus(); // ⭐️ 인증 상태를 최신으로 업데이트

      router.push("/"); // 성공 시 메인 페이지로 리디렉션
    } catch (error) {
      console.error("Signup failed:", error);
      alert("회원 정보 업데이트에 실패했습니다. 다시 시도해주세요.");
      // 필요하다면 에러 상태를 관리하여 사용자에게 더 구체적인 피드백 제공
    }
  };

  return (
    <main className="flex flex-col items-center justify-center bg-white min-h-screen py-8">
      <header className="mb-8">
        <Link href="/" aria-label="메인페이지로 이동">
          <Image
            src="/logo2.svg"
            alt="Gamza Tech Blog 로고"
            width={220}
            height={180}
            priority
          />
        </Link>
      </header>

      <section aria-label="회원가입">
        <h1 className="sr-only">회원가입</h1>

        <form
          className="w-[380px] max-w-md flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-label="회원가입 양식"
        >
          <fieldset className="flex flex-col gap-6 border-b border-[#F2F4F6] pb-10">
            <legend className="sr-only">회원 정보 입력</legend>

            {signupFields.map((field) =>
              field.type === "option" ? (
                <div key={field.id} className="flex items-center">
                  <label htmlFor={field.id} className="text-[#B5BBC7] text-base w-25">
                    {field.label}
                  </label>
                  <select
                    id={field.id}
                    {...register(field.id as keyof SignupForm)}
                    className="rounded-full px-6 py-3 border border-[#F2F4F6] outline-none text-[#222] placeholder:text-[#D9D9D9] text-base bg-transparent w-full focus:ring-2 focus:ring-[#20242B]/20 transition"
                    defaultValue=""
                    aria-invalid={!!errors[field.id as keyof SignupForm]}
                    aria-describedby={errors[field.id as keyof SignupForm] ? `${field.id}-error` : undefined}
                  >
                    <option value="" disabled>
                      {field.placeholder}
                    </option>
                    {field.options?.map((option: string) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors[field.id as keyof SignupForm]?.message && (
                    <span
                      id={`${field.id}-error`}
                      className="text-red-500 text-sm"
                      role="alert"
                    >
                      {errors[field.id as keyof SignupForm]?.message}
                    </span>
                  )}
                </div>
              ) : (
                <SignupInput
                  key={field.id}
                  label={field.label}
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  register={register}
                  error={errors[field.id as keyof SignupForm]?.message}
                />
              )
            )}
          </fieldset>

          <fieldset className="flex flex-col mt-6">
            <legend className="sr-only">약관 동의</legend>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="privacy-agree1"
                {...register("privacyAgree1")}
                className="w-4 h-4 accent-[#20242B] mr-2"
                aria-describedby="privacy-agree1-desc"
              />

              <label htmlFor="privacy-agree1" className="text-[#B5BBC7] text-sm">
                <span className="text-[#6A7181]" aria-label="필수">[필수] </span>
                <span id="privacy-agree1-desc">이용약관 동의</span>
              </label>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="privacy-agree2"
                {...register("privacyAgree2")}
                className="w-4 h-4 accent-[#20242B] mr-2"
                aria-describedby="privacy-agree2-desc"
              />
              <label htmlFor="privacy-agree2" className="text-[#B5BBC7] text-sm">
                <span className="text-[#6A7181]" aria-label="필수">[필수] </span>
                <span id="privacy-agree2-desc">개인정보 수집 및 이용 동의</span>
              </label>
            </div>
          </fieldset>

          {/* 에러 메시지 표시 (선택 사항) */}
          {(errors.privacyAgree1 || errors.privacyAgree2) && (
            <div className="mt-2 text-red-500 text-sm text-center">
              {errors.privacyAgree1 && <p>{errors.privacyAgree1.message}</p>}
              {errors.privacyAgree2 && <p>{errors.privacyAgree2.message}</p>}
            </div>
          )}

          <button
            type="submit"
            className={`mt-10 rounded-full text-white text-lg font-semibold py-4 w-full focus:outline-none focus:ring-2 focus:ring-[#20242B]/20 transition-colors ${isValid ? "bg-[#20242B] hover:bg-[#1C222E]" : "bg-gray-400 cursor-not-allowed"
              }`}
            aria-label="회원가입 완료"
            disabled={!isValid}
          >
            가입하기
          </button>
        </form>
      </section>
    </main>
  );
}