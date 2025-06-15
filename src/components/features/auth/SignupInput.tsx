type SignupInputProps = {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  register: any;
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
      <label htmlFor={id} className="text-[#B5BBC7] text-[16px] w-25">
        {label}
      </label>
      <input
        type={type}
        id={id}
        {...register(id)}
        placeholder={placeholder}
        className="rounded-full px-6 py-3 border border-[#F2F4F6] outline-none text-[#222] placeholder:text-[#D9D9D9] text-base bg-transparent w-full"
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}