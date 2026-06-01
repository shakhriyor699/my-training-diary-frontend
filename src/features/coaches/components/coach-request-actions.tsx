"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";

import { acceptCoachRequest } from "@/src/features/coaches/api/accept-coach-request";
import { rejectCoachRequest } from "@/src/features/coaches/api/reject-coach-request";
import type { CoachRequest } from "@/src/features/coaches/lib/coach-requests.types";

type CoachRequestActionsProps = {
  request: CoachRequest;
  labels: {
    accept: string;
    accepting: string;
    reject: string;
    rejecting: string;
    acceptSuccess: string;
    rejectSuccess: string;
    errorFallback: string;
  };
};

export function CoachRequestActions({
  request,
  labels,
}: CoachRequestActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const acceptMutation = useMutation({
    mutationFn: () => acceptCoachRequest(request.id),
    onSuccess: () => {
      startTransition(() => {
        toast.success(labels.acceptSuccess);
        router.refresh();
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : labels.errorFallback;
      toast.error(message);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectCoachRequest(request.id),
    onSuccess: () => {
      startTransition(() => {
        toast.success(labels.rejectSuccess);
        router.refresh();
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : labels.errorFallback;
      toast.error(message);
    },
  });

  if (request.status !== "pending") {
    return null;
  }

  const disabled = acceptMutation.isPending || rejectMutation.isPending || isPending;

  return (
    <div className="mt-5 flex flex-wrap justify-end gap-3">
      <button
        type="button"
        onClick={() => acceptMutation.mutate()}
        disabled={disabled}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1cc31c] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#27d927] disabled:opacity-60"
      >
        {acceptMutation.isPending ? labels.accepting : labels.accept}
      </button>
      <button
        type="button"
        onClick={() => rejectMutation.mutate()}
        disabled={disabled}
        className="inline-flex h-11 items-center justify-center rounded-xl border border-[#ff6b5d]/20 bg-[#ff6b5d]/10 px-4 text-sm font-semibold text-[#ff9b90] transition-colors hover:bg-[#ff6b5d]/16 disabled:opacity-60"
      >
        {rejectMutation.isPending ? labels.rejecting : labels.reject}
      </button>
    </div>
  );
}
