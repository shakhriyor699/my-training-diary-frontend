"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { deleteTrainingPlan } from "@/src/features/training-plans/api/delete-training-plan";
import type { MyTrainingPlan } from "@/src/features/training-plans/lib/training-plans.types";
import { cn } from "@/src/shared/lib/utils";

type DeleteTrainingPlanButtonProps = {
  plan: MyTrainingPlan;
  triggerClassName?: string;
  labels: {
    trigger: string;
    confirmTitle: string;
    confirmDescription: string;
    confirm: string;
    deleting: string;
    cancel: string;
    success: string;
    errorFallback: string;
  };
};

export function DeleteTrainingPlanButton({
  plan,
  triggerClassName,
  labels,
}: DeleteTrainingPlanButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const mutation = useMutation({
    mutationFn: () => deleteTrainingPlan(plan.id),
    onSuccess: () => {
      startTransition(() => {
        setIsOpen(false);
        toast.success(labels.success);
        router.refresh();
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : labels.errorFallback;
      toast.error(message);
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-xl border border-[#ff6b5d]/20 bg-[#ff6b5d]/10 px-4 text-sm font-medium text-[#ff9b90] transition-colors hover:bg-[#ff6b5d]/16",
          triggerClassName,
        )}
      >
        {labels.trigger}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-[24px] border border-white/8 bg-[#090909] p-6 shadow-[0_24px_120px_rgba(0,0,0,0.42)]">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">{labels.confirmTitle}</h2>
              <p className="text-sm leading-6 text-white/48">{labels.confirmDescription}</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                {labels.cancel}
              </button>
              <button
                type="button"
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending || isPending}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#ff6b5d] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#ff7c6f] disabled:opacity-60"
              >
                {mutation.isPending || isPending ? labels.deleting : labels.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
