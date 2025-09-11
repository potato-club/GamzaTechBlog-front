import { Button } from "@/components/ui";
import { UI_CONSTANTS } from "@/constants/ui";
import { useEffect, useState } from "react";

interface PostFormActionsProps {
  mode: "create" | "edit";
  isLoading: boolean;
}

export default function PostFormActions({ mode, isLoading }: PostFormActionsProps) {
  const [uploadingDots, setUploadingDots] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setUploadingDots((prevDots) => {
          if (prevDots.length >= 3) return ".";
          return prevDots + ".";
        });
      }, 500);
    } else {
      setUploadingDots("");
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const getButtonText = () => {
    if (isLoading) {
      const baseText =
        mode === "create"
          ? UI_CONSTANTS.FORMS.BUTTONS.LOADING_CREATE
          : UI_CONSTANTS.FORMS.BUTTONS.LOADING_EDIT;
      return `${baseText}${uploadingDots}`;
    }
    return mode === "create"
      ? UI_CONSTANTS.FORMS.BUTTONS.SUBMIT
      : UI_CONSTANTS.FORMS.BUTTONS.EDIT_SUBMIT;
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <Button
        type="submit"
        className={`rounded-4xl bg-[#20242B] px-6 py-2 text-white transition-colors duration-150 ${
          isLoading ? "cursor-not-allowed opacity-70" : "hover:cursor-pointer hover:bg-[#33373E]/90"
        }`}
        disabled={isLoading}
      >
        {getButtonText()}
      </Button>
    </div>
  );
}
