import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UI_CONSTANTS } from "@/constants/ui";
import { Control } from "react-hook-form";

interface FormValues {
  title: string;
}

interface PostTitleInputProps {
  control: Control<FormValues>;
}

export default function PostTitleInput({ control }: PostTitleInputProps) {
  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              {...field}
              placeholder={UI_CONSTANTS.FORMS.PLACEHOLDERS.TITLE}
              className="h-11 w-full border-0 px-4 text-3xl shadow-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
