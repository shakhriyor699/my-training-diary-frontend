"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { updateTrainingPlan } from "@/src/features/training-plans/api/update-training-plan";
import type { MyTrainingPlan } from "@/src/features/training-plans/lib/training-plans.types";
import {
  updateTrainingPlanSchema,
  type UpdateTrainingPlanInput,
} from "@/src/features/training-plans/lib/update-training-plan.schema";

type EditTrainingPlanDialogProps = {
  plan: MyTrainingPlan;
  labels: {
    trigger: string;
    title: string;
    description: string;
    titleLabel: string;
    titlePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    submit: string;
    submitting: string;
    cancel: string;
    success: string;
    errorFallback: string;
  };
};

export function EditTrainingPlanDialog({
  plan,
  labels,
}: EditTrainingPlanDialogProps) {
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
  } = useForm<UpdateTrainingPlanInput>({
    defaultValues: {
      title: plan.title,
      description: plan.description ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: UpdateTrainingPlanInput) =>
      updateTrainingPlan(plan.id, payload),
    onSuccess: () => {
      startTransition(() => {
        setIsOpen(false);
        setFormError(null);
        reset();
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

    const parsed = updateTrainingPlanSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      if (fieldErrors.title?.[0]) {
        setError("title", { message: fieldErrors.title[0] });
      }

      if (fieldErrors.description?.[0]) {
        setError("description", { message: fieldErrors.description[0] });
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
            title: plan.title,
            description: plan.description ?? "",
          });
          setFormError(null);
          setIsOpen(true);
        }}
        className="inline-flex h-10 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
      >
        {labels.trigger}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-2xl rounded-[24px] border border-white/8 bg-[#090909] p-6 shadow-[0_24px_120px_rgba(0,0,0,0.42)]">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {labels.title}
              </h2>
              <p className="text-sm text-white/48">{labels.description}</p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <Field label={labels.titleLabel} htmlFor={`edit-plan-title-${plan.id}`}>
                <input
                  id={`edit-plan-title-${plan.id}`}
                  type="text"
                  placeholder={labels.titlePlaceholder}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                  {...register("title")}
                />
                {errors.title?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.title.message}</p>
                ) : null}
              </Field>

              <Field
                label={labels.descriptionLabel}
                htmlFor={`edit-plan-description-${plan.id}`}
              >
                <textarea
                  id={`edit-plan-description-${plan.id}`}
                  rows={4}
                  placeholder={labels.descriptionPlaceholder}
                  className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                  {...register("description")}
                />
                {errors.description?.message ? (
                  <p className="text-sm text-[#ff7b72]">
                    {errors.description.message}
                  </p>
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

type FieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};

function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <label htmlFor={htmlFor} className="space-y-2">
      <span className="block text-sm font-medium text-white/72">{label}</span>
      {children}
    </label>
  );
}
