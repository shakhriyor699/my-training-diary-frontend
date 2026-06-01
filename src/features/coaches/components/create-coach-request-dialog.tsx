"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { createCoachRequest } from "@/src/features/coaches/api/create-coach-request";
import {
  createCoachRequestSchema,
  type CreateCoachRequestInput,
} from "@/src/features/coaches/lib/create-coach-request.schema";
import type { Coach } from "@/src/features/coaches/lib/coaches.types";

type CreateCoachRequestDialogProps = {
  coach: Coach;
  labels: {
    trigger: string;
    title: string;
    description: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    cancel: string;
    success: string;
    errorFallback: string;
  };
};

export function CreateCoachRequestDialog({
  coach,
  labels,
}: CreateCoachRequestDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateCoachRequestInput>({
    defaultValues: {
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: CreateCoachRequestInput) =>
      createCoachRequest(coach.id, payload),
    onSuccess: () => {
      startTransition(() => {
        setIsOpen(false);
        setFormError(null);
        reset({ message: "" });
        toast.success(labels.success);
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

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const parsed = createCoachRequestSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      if (fieldErrors.message?.[0]) {
        setError("message", { message: fieldErrors.message[0] });
      }

      return;
    }

    await mutation.mutateAsync(parsed.data);
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1cc31c] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#27d927]"
      >
        {labels.trigger}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-xl rounded-[24px] border border-white/8 bg-[#090909] p-6 shadow-[0_24px_120px_rgba(0,0,0,0.42)]">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {labels.title}
              </h2>
              <p className="text-sm text-white/48">
                {labels.description}
              </p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <label htmlFor={`coach-request-${coach.id}`} className="space-y-2">
                <span className="block text-sm font-medium text-white/72">
                  {labels.messageLabel}
                </span>
                <textarea
                  id={`coach-request-${coach.id}`}
                  rows={5}
                  placeholder={labels.messagePlaceholder}
                  className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                  {...register("message")}
                />
                {errors.message?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.message.message}</p>
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
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  {labels.cancel}
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending || isPending}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1cc31c] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#27d927] disabled:opacity-60"
                >
                  {mutation.isPending || isPending
                    ? labels.submitting
                    : labels.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
