"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { createNutritionDay } from "@/src/features/nutrition/api/create-nutrition-day";
import {
  createNutritionDaySchema,
  type CreateNutritionDayInput,
} from "@/src/features/nutrition/lib/create-nutrition-day.schema";

type CreateNutritionDayDialogProps = {
  planId: number;
  triggerClassName?: string;
  labels: {
    trigger: string;
    title: string;
    description: string;
    dayNumberLabel: string;
    dayNumberPlaceholder: string;
    titleLabel: string;
    titlePlaceholder: string;
    submit: string;
    submitting: string;
    cancel: string;
    success: string;
    errorFallback: string;
  };
};

export function CreateNutritionDayDialog({
  planId,
  triggerClassName,
  labels,
}: CreateNutritionDayDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateNutritionDayInput>({
    defaultValues: {
      dayNumber: 1,
      title: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: CreateNutritionDayInput) =>
      createNutritionDay(planId, payload),
    onSuccess: () => {
      startTransition(() => {
        setIsOpen(false);
        setFormError(null);
        reset({
          dayNumber: 1,
          title: "",
        });
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

    const parsed = createNutritionDaySchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      if (fieldErrors.dayNumber?.[0]) {
        setError("dayNumber", { message: fieldErrors.dayNumber[0] });
      }

      if (fieldErrors.title?.[0]) {
        setError("title", { message: fieldErrors.title[0] });
      }

      return;
    }

    await mutation.mutateAsync(parsed.data);
  });

  return (
    <>
      <button
        type="button"
        onClick={() => {
          reset({
            dayNumber: 1,
            title: "",
          });
          setFormError(null);
          setIsOpen(true);
        }}
        className={
          triggerClassName ??
          "inline-flex h-11 items-center justify-center rounded-xl bg-[#f59e0b] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#fbbf24]"
        }
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
              <p className="text-sm text-white/48">{labels.description}</p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <Field
                label={labels.dayNumberLabel}
                htmlFor={`create-nutrition-day-number-${planId}`}
              >
                <input
                  id={`create-nutrition-day-number-${planId}`}
                  type="number"
                  min="1"
                  placeholder={labels.dayNumberPlaceholder}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#f59e0b]/50 focus:ring-4 focus:ring-[#f59e0b]/10"
                  {...register("dayNumber", { valueAsNumber: true })}
                />
                {errors.dayNumber?.message ? (
                  <p className="text-sm text-[#ff7b72]">
                    {errors.dayNumber.message}
                  </p>
                ) : null}
              </Field>

              <Field
                label={labels.titleLabel}
                htmlFor={`create-nutrition-day-title-${planId}`}
              >
                <input
                  id={`create-nutrition-day-title-${planId}`}
                  type="text"
                  placeholder={labels.titlePlaceholder}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#f59e0b]/50 focus:ring-4 focus:ring-[#f59e0b]/10"
                  {...register("title")}
                />
                {errors.title?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.title.message}</p>
                ) : null}
              </Field>

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
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f59e0b] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#fbbf24] disabled:opacity-60"
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

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="space-y-2">
      <span className="block text-sm font-medium text-white/72">{label}</span>
      {children}
    </label>
  );
}

