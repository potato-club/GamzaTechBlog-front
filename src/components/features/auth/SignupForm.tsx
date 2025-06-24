"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import signupFields from "@/constants/signupFields";
import { SignupFormValues } from "@/lib/schemas/signupSchema";
import { UseFormReturn } from "react-hook-form";

const inputStyle =
  "flex items-center rounded-full px-6 h-12 border border-[#F2F4F6] outline-none text-[#222] placeholder:text-[#D9D9D9] text-base bg-transparent w-full focus:ring-2 focus:ring-[#20242B]/20 transition";

interface SignupFormProps {
  form: UseFormReturn<SignupFormValues>;
  onSubmit: (data: SignupFormValues) => void;
  isValid: boolean;
}

export default function SignupForm({ form, onSubmit, isValid }: SignupFormProps) {
  const { handleSubmit, control } = form;

  return (
    <Form {...form}>
      <form
        className="w-[380px] max-w-md flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="회원가입 양식"
      >
        <fieldset className="flex flex-col gap-6 border-b border-[#F2F4F6] pb-10">
          <legend className="sr-only">회원 정보 입력</legend>

          {signupFields.map((fieldInfo) => (
            <FormField
              key={fieldInfo.id}
              control={control}
              name={fieldInfo.id as keyof SignupFormValues}
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel className="text-[#B5BBC7] text-base w-25">
                    {fieldInfo.label}
                  </FormLabel>
                  <div className="w-full">
                    <FormControl>
                      {fieldInfo.type === "option" ? (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value as string}
                          name={field.name}
                        >
                          <SelectTrigger className={inputStyle}>
                            <SelectValue placeholder={fieldInfo.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldInfo.options?.map((option: string) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          {...field}
                          name={field.name}
                          value={String(field.value ?? "")}
                          type={fieldInfo.type}
                          placeholder={fieldInfo.placeholder}
                          className={inputStyle}
                        />
                      )}
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm ml-2 mt-1" />
                  </div>
                </FormItem>
              )}
            />
          ))}
        </fieldset>

        <fieldset className="flex flex-col mt-6">
          <legend className="sr-only">약관 동의</legend>

          <FormField
            control={control}
            name="privacyAgree1"
            render={({ field }) => (
              <FormItem className="mb-4">
                <div className="flex items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="privacy-agree1"
                      className="w-4 h-4 data-[state=checked]:bg-[#20242B] data-[state=checked]:text-white mr-2"
                      aria-describedby="privacy-agree1-desc"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="privacy-agree1"
                    className="text-sm font-normal text-[#B5BBC7] cursor-pointer"
                  >
                    <span className="text-[#6A7181]" aria-label="필수">
                      [필수]{" "}
                    </span>
                    <span id="privacy-agree1-desc">이용약관 동의</span>
                  </FormLabel>
                </div>
                <FormMessage className="text-red-500 text-sm pl-6" />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="privacyAgree2"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="privacy-agree2"
                      className="w-4 h-4 data-[state=checked]:bg-[#20242B] data-[state=checked]:text-white mr-2"
                      aria-describedby="privacy-agree2-desc"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="privacy-agree2"
                    className="text-sm font-normal text-[#B5BBC7] cursor-pointer"
                  >
                    <span className="text-[#6A7181]" aria-label="필수">
                      [필수]{" "}
                    </span>
                    <span id="privacy-agree2-desc">
                      개인정보 수집 및 이용 동의
                    </span>
                  </FormLabel>
                </div>
                <FormMessage className="text-red-500 text-sm pl-6" />
              </FormItem>
            )}
          />
        </fieldset>

        <div className="mt-10">
          <Button
            type="submit"
            className="w-full h-12 rounded-full bg-[#20242B] text-white text-base disabled:bg-[#F2F4F6] disabled:text-[#B5BBC7]"
            disabled={!isValid}
            aria-label="회원가입 완료"
          >
            가입 완료
          </Button>
        </div>
      </form>
    </Form>
  );
}
