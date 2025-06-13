"use client";

import SignupInput from "@/components/features/auth/SignupInput";
import signupFields from "@/constants/signupFields";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("올바른 이메일을 입력해주세요").optional(),
  studentNumber: z.string().optional(),
  potatoGeneration: z.string().optional(),
  position: z.string().optional()
});

type SignupForm = z.infer<typeof schema>;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: SignupForm) => {
    // 회원가입 처리 로직
    console.log(data);
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
                className="w-4 h-4 accent-[#20242B] mr-2"
                required
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
                className="w-4 h-4 accent-[#20242B] mr-2"
                required
                aria-describedby="privacy-agree2-desc"
              />
              <label htmlFor="privacy-agree2" className="text-[#B5BBC7] text-sm">
                <span className="text-[#6A7181]" aria-label="필수">[필수] </span>
                <span id="privacy-agree2-desc">개인정보 수집 및 이용 동의</span>
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            className="mt-10 rounded-full bg-[#20242B] text-white text-lg font-semibold py-4 w-full hover:bg-[#1C222E] focus:outline-none focus:ring-2 focus:ring-[#20242B]/20 transition-colors"
            aria-label="회원가입 완료"
          >
            가입하기
          </button>
        </form>
      </section>
    </main>
  );
}