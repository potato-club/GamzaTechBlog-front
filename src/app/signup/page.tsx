"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SignupInput from "../../components/SignupInput";
import signupFields from "../../constants/signupFields";

const schema = z.object({
  username: z.string().optional(),
  email: z.string().email("올바른 이메일을 입력해주세요").optional(),
  studentId: z.string().optional(),
  gamzaGeneration: z.string().optional(),
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
    <main className="flex flex-col items-center justify-center min-h-screen bg-white">
      <form
        className="w-[380px] max-w-md flex flex-col gap-6 mt-10"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {signupFields.map((field) => (
          <SignupInput
            key={field.id}
            label={field.label}
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            register={register}
            error={errors[field.id as keyof SignupForm]?.message}
          />
        ))}
        <button
          type="submit"
          className="mt-10 rounded-full bg-[#FAA631] text-white text-lg font-semibold py-4 w-full"
        >
          가입하기
        </button>
      </form>
    </main>
  );
}