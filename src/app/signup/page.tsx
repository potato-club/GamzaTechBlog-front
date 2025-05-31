"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import mainLogo from "../../../public/logo2.svg";
import SignupInput from "../../components/SignupInput";
import signupFields from "../../constants/signupFields";

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
    <main className="flex flex-col items-center justify-centerbg-white">
      <Image
        src={mainLogo}
        alt="메인페이지 로고"
        width={220}
        height={180}
        className="mx-auto"
      />
      <form
        className="w-[380px] max-w-md flex flex-col mt-15"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex flex-col gap-6 border-b-1 border-[#F2F4F6] pb-10">
          {signupFields.map((field) =>
            field.type === "option" ? (
              <div key={field.id} className="flex items-center">
                <label htmlFor={field.id} className="text-[#B5BBC7] text-base w-25">
                  {field.label}
                </label>
                <select
                  id={field.id}
                  {...register(field.id as keyof SignupForm)}
                  className="rounded-full px-6 py-3 border border-[#F2F4F6] outline-none text-[#222] placeholder:text-[#D9D9D9] text-base bg-transparent w-full"
                  defaultValue=""
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
                  <span className="text-red-500 text-sm">
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
        </div>
        <div className="flex flex-col mt-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="privacy-agree1"
              className="w-4 h-4 accent-[#20242B] mr-2"
              required
            />
            <label htmlFor="privacy-agree1" className="text-[#B5BBC7] text-sm">
              <span className="text-[#6A7181]">[필수] </span>
              이용약관 동의
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="privacy-agree2"
              className="w-4 h-4 accent-[#20242B] mr-2"
              required
            />
            <label htmlFor="privacy-agree2" className="text-[#B5BBC7] text-sm">
              <span className="text-[#6A7181]">[필수] </span>
              개인정보 수집 및 이용 동의
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mt-10 rounded-full bg-[#20242B] text-white text-lg font-semibold py-4 w-full"
        >
          가입하기
        </button>
      </form>
    </main>
  );
}