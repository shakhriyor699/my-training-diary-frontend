"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { createNutritionMeal } from "@/src/features/nutrition/api/create-nutrition-meal";
import {
  createNutritionMealSchema,
  type CreateNutritionMealInput,
} from "@/src/features/nutrition/lib/create-nutrition-meal.schema";

type CreateNutritionMealDialogProps = {
  dayId: number;
  triggerClassName?: string;
  labels: {
    trigger: string;
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    timeLabel: string;
    timePlaceholder: string;
    submit: string;
    submitting: string;
    cancel: string;
    success: string;
    errorFallback: string;
  };
};

export function CreateNutritionMealDialog({
  dayId,
  triggerClassName,
  labels,
}: CreateNutritionMealDialogProps) {
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
  } = useForm<CreateNutritionMealInput>({
    defaultValues: {
      name: "",
      time: "08:00",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: CreateNutritionMealInput) =>
      createNutritionMeal(dayId, payload),
    onSuccess: () => {
      startTransition(() => {
        setIsOpen(false);
        setFormError(null);
        reset({
          name: "",
          time: "08:00",
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

    const parsed = createNutritionMealSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      if (fieldErrors.name?.[0]) {
        setError("name", { message: fieldErrors.name[0] });
      }

      if (fieldErrors.time?.[0]) {
        setError("time", { message: fieldErrors.time[0] });
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
            name: "",
            time: "08:00",
          });
          setFormError(null);
          setIsOpen(true);
        }}
        className={
          triggerClassName ??
          "inline-flex h-10 items-center justify-center rounded-[10px] border border-white/14 bg-transparent px-4 text-white shadow-none hover:bg-white/[0.04] sm:w-auto"
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
              <Field label={labels.nameLabel} htmlFor={`create-meal-name-${dayId}`}>
                <input
                  id={`create-meal-name-${dayId}`}
                  type="text"
                  placeholder={labels.namePlaceholder}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#f59e0b]/50 focus:ring-4 focus:ring-[#f59e0b]/10"
                  {...register("name")}
                />
                {errors.name?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.name.message}</p>
                ) : null}
              </Field>

              <Field label={labels.timeLabel} htmlFor={`create-meal-time-${dayId}`}>
                <input
                  id={`create-meal-time-${dayId}`}
                  type="time"
                  placeholder={labels.timePlaceholder}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#f59e0b]/50 focus:ring-4 focus:ring-[#f59e0b]/10"
                  {...register("time")}
                />
                {errors.time?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.time.message}</p>
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

