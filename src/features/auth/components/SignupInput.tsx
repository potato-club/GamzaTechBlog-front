import { UseFormRegister, FieldValues } from "react-hook-form";

type SignupInputProps = {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  register: UseFormRegister<FieldValues>;
  error?: string;
};

export default function SignupInput({
  label,
  id,
  type = "text",
  placeholder,
  register,
  error,
}: SignupInputProps) {
  return (
    <div className="flex items-center">
      <label htmlFor={id} className="w-25 text-[16px] text-[#B5BBC7]">
        {label}
      </label>
      <input
        type={type}
        id={id}
        {...register(id)}
        placeholder={placeholder}
        className="w-full rounded-full border border-[#F2F4F6] bg-transparent px-6 py-3 text-base text-[#222] outline-none placeholder:text-[#D9D9D9]"
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
