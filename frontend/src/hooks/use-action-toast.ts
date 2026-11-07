"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

type ActionFeedback = {
  errors: string[];
  success: boolean;
};

export function useActionToast(
  state: ActionFeedback,
  successMessage: string,
) {
  useEffect(() => {
    state.errors.forEach((error) => toast.error(error));
  }, [state.errors]);

  useEffect(() => {
    if (state.success) {
      toast.success(successMessage);
    }
  }, [state.success, successMessage]);
}
