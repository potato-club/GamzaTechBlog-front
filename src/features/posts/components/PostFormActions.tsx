"use client";

import { Button } from "@/components/ui";
import { UI_CONSTANTS } from "@/constants/ui";
import { useLoadingDots } from "@/hooks/useLoadingDots";

interface PostFormActionsProps {
  mode: "create" | "edit";
  isLoading: boolean;
}

export default function PostFormActions({ mode, isLoading }: PostFormActionsProps) {
  const uploadingDots = useLoadingDots(isLoading);

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
        variant={isLoading ? "primary-loading" : "primary"}
        size="rounded-lg"
        disabled={isLoading}
      >
        {getButtonText()}
      </Button>
    </div>
  );
}
