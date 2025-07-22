"use client";

/**
 * 회원가입 페이지
 * 
 * TanStack Query의 useUpdateProfileInSignup 뮤테이션을 사용하여
 * 회원가입 프로필 업데이트를 효율적으로 처리합니다.
 */

import SignupForm from "@/components/features/auth/SignupForm";
import { Position } from "@/enums/position";
import { useAuth, useUpdateProfileInSignup } from "@/hooks/queries/useUserQueries";
import {
  SignupFormValues,
  signupSchema,
} from "@/lib/schemas/signupSchema";
import type { UserProfileData } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function SignupPage() {
  const router = useRouter();
  const { refetchAuthStatus } = useAuth();

  /**
   * TanStack Query 뮤테이션을 사용한 회원가입 프로필 업데이트
   * 
   * 이 훅의 장점:
   * - 자동 캐시 관리: 사용자 프로필 캐시 자동 업데이트
   * - 로딩 상태: isPending을 통한 폼 비활성화
   * - 에러 처리: 자동 에러 핸들링 및 롤백
   * - 성공 후 처리: onSuccess 콜백을 통한 리디렉션
   */
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
    const positionKey = (
      Object.keys(Position) as Array<keyof typeof Position>
    ).find((key) => Position[key] === data.position);

    const payload: Partial<UserProfileData> = {
      email: data.email,
      studentNumber: data.studentNumber,
      gamjaBatch: data.gamjaBatch,
      position: positionKey,
    };

    // TanStack Query 뮤테이션 실행
    try {
      await updateProfileMutation.mutateAsync(payload);

      // 인증 상태 업데이트 (기존 로직 유지)
      await refetchAuthStatus();

      // 성공 시 메인 페이지로 이동
      router.push("/");

    } catch (error) {
      // 에러는 TanStack Query의 onError에서 이미 처리됨
      // 추가 사용자 피드백이 필요하면 여기에 추가
      console.error("Signup failed:", error);
      alert("회원 정보 업데이트에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center bg-white min-h-screen">
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