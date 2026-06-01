"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { createStudentNutritionPlan } from "@/src/features/nutrition/api/create-student-nutrition-plan";
import {
  createStudentNutritionPlanSchema,
  type CreateStudentNutritionPlanInput,
} from "@/src/features/nutrition/lib/create-student-nutrition-plan.schema";
import type {
  CreateStudentNutritionPlanLabels,
  NutritionOption,
} from "@/src/features/nutrition/lib/nutrition.types";

type CreateStudentNutritionPlanDialogProps = {
  studentId: number;
  goalOptions: NutritionOption[];
  genderOptions: NutritionOption[];
  activityOptions: NutritionOption[];
  labels: CreateStudentNutritionPlanLabels;
};

const defaultValues: CreateStudentNutritionPlanInput = {
  title: "",
  goal: "bulk",
  weightKg: 66,
  heightCm: 175,
  age: 24,
  gender: "male",
  activity: "medium",
};

export function CreateStudentNutritionPlanDialog({
  studentId,
  goalOptions,
  genderOptions,
  activityOptions,
  labels,
}: CreateStudentNutritionPlanDialogProps) {
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
  } = useForm<CreateStudentNutritionPlanInput>({
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: (payload: CreateStudentNutritionPlanInput) =>
      createStudentNutritionPlan(studentId, payload),
    onSuccess: () => {
      startTransition(() => {
        setIsOpen(false);
        setFormError(null);
        reset(defaultValues);
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

    const parsed = createStudentNutritionPlanSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      if (fieldErrors.title?.[0]) {
        setError("title", { message: fieldErrors.title[0] });
      }

      if (fieldErrors.goal?.[0]) {
        setError("goal", { message: fieldErrors.goal[0] });
      }

      if (fieldErrors.weightKg?.[0]) {
        setError("weightKg", { message: fieldErrors.weightKg[0] });
      }

      if (fieldErrors.heightCm?.[0]) {
        setError("heightCm", { message: fieldErrors.heightCm[0] });
      }

      if (fieldErrors.age?.[0]) {
        setError("age", { message: fieldErrors.age[0] });
      }

      if (fieldErrors.gender?.[0]) {
        setError("gender", { message: fieldErrors.gender[0] });
      }

      if (fieldErrors.activity?.[0]) {
        setError("activity", { message: fieldErrors.activity[0] });
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
        className="inline-flex h-12 items-center justify-center rounded-xl bg-[#f59e0b] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#fbbf24]"
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
              <Field label={labels.titleLabel} htmlFor="nutrition-plan-title">
                <input
                  id="nutrition-plan-title"
                  type="text"
                  placeholder={labels.titlePlaceholder}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#f59e0b]/50 focus:ring-4 focus:ring-[#f59e0b]/10"
                  {...register("title")}
                />
                {errors.title?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.title.message}</p>
                ) : null}
              </Field>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label={labels.goalLabel} htmlFor="nutrition-plan-goal">
                  <select
                    id="nutrition-plan-goal"
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#f59e0b]/50 focus:ring-4 focus:ring-[#f59e0b]/10"
                    {...register("goal")}
                  >
                    {goalOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-[#090909] text-white"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.goal?.message ? (
                    <p className="text-sm text-[#ff7b72]">{errors.goal.message}</p>
                  ) : null}
                </Field>

                <Field
                  label={labels.genderLabel}
                  htmlFor="nutrition-plan-gender"
                >
                  <select
                    id="nutrition-plan-gender"
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#f59e0b]/50 focus:ring-4 focus:ring-[#f59e0b]/10"
                    {...register("gender")}
                  >
                    {genderOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-[#090909] text-white"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.gender?.message ? (
                    <p className="text-sm text-[#ff7b72]">
                      {errors.gender.message}
                    </p>
                  ) : null}
                </Field>

                <Field
                  label={labels.activityLabel}
                  htmlFor="nutrition-plan-activity"
                >
                  <select
                    id="nutrition-plan-activity"
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#f59e0b]/50 focus:ring-4 focus:ring-[#f59e0b]/10"
                    {...register("activity")}
                  >
                    {activityOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-[#090909] text-white"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.activity?.message ? (
                    <p className="text-sm text-[#ff7b72]">
                      {errors.activity.message}
                    </p>
                  ) : null}
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label={labels.weightLabel} htmlFor="nutrition-plan-weight">
                  <input
                    id="nutrition-plan-weight"
                    type="number"
                    min="1"
                    step="0.1"
                    placeholder={labels.weightPlaceholder}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#f59e0b]/50 focus:ring-4 focus:ring-[#f59e0b]/10"
                    {...register("weightKg", { valueAsNumber: true })}
                  />
                  {errors.weightKg?.message ? (
                    <p className="text-sm text-[#ff7b72]">
                      {errors.weightKg.message}
                    </p>
                  ) : null}
                </Field>

                <Field label={labels.heightLabel} htmlFor="nutrition-plan-height">
                  <input
                    id="nutrition-plan-height"
                    type="number"
                    min="1"
                    step="1"
                    placeholder={labels.heightPlaceholder}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#f59e0b]/50 focus:ring-4 focus:ring-[#f59e0b]/10"
                    {...register("heightCm", { valueAsNumber: true })}
                  />
                  {errors.heightCm?.message ? (
                    <p className="text-sm text-[#ff7b72]">
                      {errors.heightCm.message}
                    </p>
                  ) : null}
                </Field>

                <Field label={labels.ageLabel} htmlFor="nutrition-plan-age">
                  <input
                    id="nutrition-plan-age"
                    type="number"
                    min="1"
                    step="1"
                    placeholder={labels.agePlaceholder}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#f59e0b]/50 focus:ring-4 focus:ring-[#f59e0b]/10"
                    {...register("age", { valueAsNumber: true })}
                  />
                  {errors.age?.message ? (
                    <p className="text-sm text-[#ff7b72]">{errors.age.message}</p>
                  ) : null}
                </Field>
              </div>

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

