"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { toast } from "react-toastify";

import { createNutritionFood } from "@/src/features/nutrition/api/create-nutrition-food";
import {
  createNutritionFoodSchema,
  type CreateNutritionFoodInput,
} from "@/src/features/nutrition/lib/create-nutrition-food.schema";

type CreateNutritionFoodDialogProps = {
  mealId: number;
  triggerClassName?: string;
  labels: {
    trigger: string;
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    gramsLabel: string;
    gramsPlaceholder: string;
    caloriesLabel: string;
    caloriesPlaceholder: string;
    proteinLabel: string;
    proteinPlaceholder: string;
    fatLabel: string;
    fatPlaceholder: string;
    carbsLabel: string;
    carbsPlaceholder: string;
    submit: string;
    submitting: string;
    cancel: string;
    success: string;
    errorFallback: string;
  };
};

const defaultValues: CreateNutritionFoodInput = {
  name: "",
  grams: 100,
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
};

export function CreateNutritionFoodDialog({
  mealId,
  triggerClassName,
  labels,
}: CreateNutritionFoodDialogProps) {
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
  } = useForm<CreateNutritionFoodInput>({
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: (payload: CreateNutritionFoodInput) =>
      createNutritionFood(mealId, payload),
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

    const parsed = createNutritionFoodSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      if (fieldErrors.name?.[0]) {
        setError("name", { message: fieldErrors.name[0] });
      }

      if (fieldErrors.grams?.[0]) {
        setError("grams", { message: fieldErrors.grams[0] });
      }

      if (fieldErrors.calories?.[0]) {
        setError("calories", { message: fieldErrors.calories[0] });
      }

      if (fieldErrors.protein?.[0]) {
        setError("protein", { message: fieldErrors.protein[0] });
      }

      if (fieldErrors.fat?.[0]) {
        setError("fat", { message: fieldErrors.fat[0] });
      }

      if (fieldErrors.carbs?.[0]) {
        setError("carbs", { message: fieldErrors.carbs[0] });
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
          reset(defaultValues);
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
          <div className="w-full max-w-2xl rounded-[24px] border border-white/8 bg-[#090909] p-6 shadow-[0_24px_120px_rgba(0,0,0,0.42)]">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {labels.title}
              </h2>
              <p className="text-sm text-white/48">{labels.description}</p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <Field label={labels.nameLabel} htmlFor={`create-food-name-${mealId}`}>
                <input
                  id={`create-food-name-${mealId}`}
                  type="text"
                  placeholder={labels.namePlaceholder}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#f59e0b]/50 focus:ring-4 focus:ring-[#f59e0b]/10"
                  {...register("name")}
                />
                {errors.name?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.name.message}</p>
                ) : null}
              </Field>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <NumberField
                  htmlFor={`create-food-grams-${mealId}`}
                  label={labels.gramsLabel}
                  placeholder={labels.gramsPlaceholder}
                  error={errors.grams?.message}
                  register={register("grams", { valueAsNumber: true })}
                />
                <NumberField
                  htmlFor={`create-food-calories-${mealId}`}
                  label={labels.caloriesLabel}
                  placeholder={labels.caloriesPlaceholder}
                  error={errors.calories?.message}
                  register={register("calories", { valueAsNumber: true })}
                />
                <NumberField
                  htmlFor={`create-food-protein-${mealId}`}
                  label={labels.proteinLabel}
                  placeholder={labels.proteinPlaceholder}
                  error={errors.protein?.message}
                  register={register("protein", { valueAsNumber: true })}
                />
                <NumberField
                  htmlFor={`create-food-fat-${mealId}`}
                  label={labels.fatLabel}
                  placeholder={labels.fatPlaceholder}
                  error={errors.fat?.message}
                  register={register("fat", { valueAsNumber: true })}
                />
                <NumberField
                  htmlFor={`create-food-carbs-${mealId}`}
                  label={labels.carbsLabel}
                  placeholder={labels.carbsPlaceholder}
                  error={errors.carbs?.message}
                  register={register("carbs", { valueAsNumber: true })}
                />
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

function NumberField({
  htmlFor,
  label,
  placeholder,
  error,
  register,
}: {
  htmlFor: string;
  label: string;
  placeholder: string;
  error?: string;
  register: UseFormRegisterReturn;
}) {
  return (
    <Field label={label} htmlFor={htmlFor}>
      <input
        id={htmlFor}
        type="number"
        min="0"
        step="0.1"
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#f59e0b]/50 focus:ring-4 focus:ring-[#f59e0b]/10"
        {...register}
      />
      {error ? <p className="text-sm text-[#ff7b72]">{error}</p> : null}
    </Field>
  );
}
