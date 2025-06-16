"use client";

import SignupForm from "@/components/features/auth/SignupForm";
import { Position } from "@/enums/position";
import { useAuth } from "@/hooks/useAuth";
import {
  SignupFormValues,
  signupSchema,
} from "@/lib/schemas/signupSchema";
import { userService } from "@/services/userService";
import type { UserProfileData } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function SignupPage() {
  const router = useRouter();
  const { refetchAuthStatus } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      studentNumber: "",
      gamjaBatch: undefined,
      position: undefined,
      privacyAgree1: false,
      privacyAgree2: false,
    },
    mode: "onChange",
  });

  const { isValid } = form.formState;

  const onSubmit = async (data: SignupFormValues) => {
    const positionKey = (
      Object.keys(Position) as Array<keyof typeof Position>
    ).find((key) => Position[key] === data.position);

    const payload: Partial<UserProfileData> = {
      email: data.email,
      studentNumber: data.studentNumber,
      gamjaBatch: data.gamjaBatch,
      position: positionKey,
    };

    try {
      await userService.updateProfileInSignup(payload);
      await refetchAuthStatus();
      router.push("/");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("회원 정보 업데이트에 실패했습니다. 다시 시도해주세요.");
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
        <SignupForm form={form} onSubmit={onSubmit} isValid={isValid} />
      </section>
    </main>
  );
}