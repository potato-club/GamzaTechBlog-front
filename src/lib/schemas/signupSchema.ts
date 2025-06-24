import { Position } from "@/enums/position";
import { z } from "zod";

const positionDisplayNames = Object.values(Position) as [string, ...string[]];

export const signupSchema = z.object({
  email: z.string().email("올바른 이메일을 입력해주세요"),
  studentNumber: z.string().min(1, "학번을 입력해주세요."),
  gamjaBatch: z.coerce
    .number({ invalid_type_error: "숫자만 입력 가능합니다." })
    .positive("기수를 올바르게 입력해주세요."),
  position: z.enum(positionDisplayNames, {
    required_error: "직군을 선택해주세요.",
  }),
  privacyAgree1: z.boolean().refine((val) => val === true, {
    message: "이용약관에 동의해주세요.",
  }),
  privacyAgree2: z.boolean().refine((val) => val === true, {
    message: "개인정보 수집 및 이용에 동의해주세요.",
  }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
