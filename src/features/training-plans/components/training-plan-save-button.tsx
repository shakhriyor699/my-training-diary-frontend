"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { toggleTrainingPlanSave } from "@/src/features/training-plans/api/toggle-training-plan-save";

type TrainingPlanSaveButtonProps = {
  planId: number;
  initialSaved: boolean;
  onStateChange?: (state: { saved: boolean }) => void;
  labels: {
    save: string;
    savedAction: string;
    errorFallback: string;
  };
};

export function TrainingPlanSaveButton({
  planId,
  initialSaved,
  onStateChange,
  labels,
}: TrainingPlanSaveButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(initialSaved);

  const mutation = useMutation({
    mutationFn: () => toggleTrainingPlanSave(planId),
    onSuccess: (response) => {
      setSaved(response.saved);
      onStateChange?.({ saved: response.saved });

      startTransition(() => {
        router.refresh();
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : labels.errorFallback;
      toast.error(message);
    },
  });

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending || isPending}
      aria-pressed={saved}
      aria-label={saved ? labels.savedAction : labels.save}
      title={saved ? labels.savedAction : labels.save}
      className={[
        "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 disabled:opacity-60",
        saved
          ? "border-[#d8f76d]/30 bg-[#d8f76d]/12 text-[#d8f76d] hover:bg-[#d8f76d]/18"
          : "border-white/10 bg-white/[0.03] text-white/78 hover:bg-white/[0.06] hover:text-white",
      ].join(" ")}
    >
      <BookmarkIcon filled={saved} />
    </button>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={[
        "h-5 w-5 transition-transform duration-200",
        filled ? "scale-110 fill-[#d8f76d] text-[#d8f76d]" : "fill-transparent text-white/82",
      ].join(" ")}
    >
      <path
        d="M7 3.8h10a1.2 1.2 0 0 1 1.2 1.2v15.12L12 16.25 5.8 20.12V5A1.2 1.2 0 0 1 7 3.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
