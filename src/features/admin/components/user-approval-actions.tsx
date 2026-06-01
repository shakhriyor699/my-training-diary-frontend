"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { updateUserApproval } from "@/src/features/admin/api/update-user-approval";
import {
  updateUserApprovalSchema,
  type UpdateUserApprovalInput,
} from "@/src/features/admin/lib/update-user-approval.schema";

type UserApprovalActionsProps = {
  userId: number;
  labels: {
    approve: string;
    approving: string;
    reject: string;
    rejectTitle: string;
    rejectDescription: string;
    rejectReason: string;
    rejectReasonPlaceholder: string;
    submitReject: string;
    rejecting: string;
    cancel: string;
    approveSuccess: string;
    rejectSuccess: string;
    errorFallback: string;
  };
};

export function UserApprovalActions({
  userId,
  labels,
}: UserApprovalActionsProps) {
  const router = useRouter();
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateUserApprovalInput>({
    defaultValues: {
      status: "rejected",
      reason: "",
    },
  });

  const approveMutation = useMutation({
    mutationFn: () =>
      updateUserApproval(userId, {
        status: "approved",
      }),
    onSuccess: () => {
      startTransition(() => {
        toast.success(labels.approveSuccess);
        router.refresh();
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : labels.errorFallback);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (payload: UpdateUserApprovalInput) =>
      updateUserApproval(userId, payload),
    onSuccess: () => {
      startTransition(() => {
        setIsRejectOpen(false);
        setFormError(null);
        reset({
          status: "rejected",
          reason: "",
        });
        toast.success(labels.rejectSuccess);
        router.refresh();
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : labels.errorFallback;
      setFormError(message);
      toast.error(message);
    },
  });

  const onRejectSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const parsed = updateUserApprovalSchema.safeParse({
      status: "rejected",
      reason: values.reason,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      if (fieldErrors.reason?.[0]) {
        setError("reason", { message: fieldErrors.reason[0] });
      }

      return;
    }

    await rejectMutation.mutateAsync(parsed.data);
  });

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => approveMutation.mutate()}
          disabled={approveMutation.isPending || rejectMutation.isPending || isPending}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-[#1cc31c] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#27d927] disabled:opacity-60"
        >
          {approveMutation.isPending ? labels.approving : labels.approve}
        </button>
        <button
          type="button"
          onClick={() => {
            reset({
              status: "rejected",
              reason: "",
            });
            setFormError(null);
            setIsRejectOpen(true);
          }}
          disabled={approveMutation.isPending || rejectMutation.isPending || isPending}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-[#ff6b5d]/20 bg-[#ff6b5d]/10 px-4 text-sm font-semibold text-[#ff9b90] transition-colors hover:bg-[#ff6b5d]/16 disabled:opacity-60"
        >
          {labels.reject}
        </button>
      </div>

      {isRejectOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-xl rounded-[24px] border border-white/8 bg-[#090909] p-6 shadow-[0_24px_120px_rgba(0,0,0,0.42)]">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold text-white">{labels.rejectTitle}</h2>
              <p className="text-sm text-white/48">{labels.rejectDescription}</p>
            </div>

            <form className="space-y-4" onSubmit={onRejectSubmit}>
              <label htmlFor={`reject-user-reason-${userId}`} className="space-y-2">
                <span className="block text-sm font-medium text-white/72">
                  {labels.rejectReason}
                </span>
                <textarea
                  id={`reject-user-reason-${userId}`}
                  rows={4}
                  placeholder={labels.rejectReasonPlaceholder}
                  className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#ff6b5d]/50 focus:ring-4 focus:ring-[#ff6b5d]/10"
                  {...register("reason")}
                />
                {errors.reason?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.reason.message}</p>
                ) : null}
              </label>

              {formError ? (
                <div className="rounded-2xl border border-[#ff7b72]/18 bg-[#ff7b72]/8 px-4 py-3 text-sm text-[#ff7b72]">
                  {formError}
                </div>
              ) : null}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRejectOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  {labels.cancel}
                </button>
                <button
                  type="submit"
                  disabled={rejectMutation.isPending || approveMutation.isPending || isPending}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#ff6b5d] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#ff7c6f] disabled:opacity-60"
                >
                  {rejectMutation.isPending ? labels.rejecting : labels.submitReject}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
