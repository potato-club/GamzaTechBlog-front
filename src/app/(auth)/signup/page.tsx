"use client";

/**
 * 회원가입 페이지
 *
 * 서버 액션 기반 훅으로 회원가입 프로필 업데이트를 처리합니다.
 */

import { Position } from "@/enums/position";
import { SignupForm } from "@/features/auth";
import type { UserProfileRequest } from "@/generated/orval/models";
import { useAuth } from "@/hooks/useAuth";
import { SignupFormValues, signupSchema } from "@/lib/schemas/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useUpdateProfileInSignup } from "../../../features";

export default function SignupPage() {
  const router = useRouter();
  const { refetchAuthStatus } = useAuth();

  const updateProfileMutation = useUpdateProfileInSignup();

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
    const positionKey = (Object.keys(Position) as Array<keyof typeof Position>).find(
      (key) => Position[key] === data.position
    );

    const payload: UserProfileRequest = {
      email: data.email,
      studentNumber: data.studentNumber,
      gamjaBatch: data.gamjaBatch,
      position: positionKey as UserProfileRequest["position"],
    };

    try {
      const result = await updateProfileMutation.mutateAsync(payload);
      if (!result.success) {
        throw new Error(result.error);
      }

      // 인증 상태 업데이트 (기존 로직 유지)
      await refetchAuthStatus();

      // 성공 시 메인 페이지로 이동
      router.push("/");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("회원 정보 업데이트에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <header className="mb-8">
        <Link href="/" aria-label="메인페이지로 이동">
          <Image src="/logo2.svg" alt="Gamza Tech Blog 로고" width={220} height={180} priority />
        </Link>
      </header>

      <section aria-label="회원가입">
        <h1 className="sr-only">회원가입</h1>
        <SignupForm form={form} onSubmitAction={onSubmit} isValid={isValid} />
      </section>
    </div>
  );
}
