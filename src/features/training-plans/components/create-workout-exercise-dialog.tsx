"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { refreshGymCoinWallet } from "@/src/features/gymcoin/api/gymcoin-client";
import { GymCoinFeatureAccessPanel } from "@/src/features/gymcoin/components/gymcoin-feature-access-panel";
import { useGymCoinFeatureAccess } from "@/src/features/gymcoin/components/use-gymcoin-feature-access";
import {
  DEFAULT_GYMCOIN_COSTS,
  GYMCOIN_FEATURES,
} from "@/src/features/gymcoin/lib/gymcoin.constants";
import { createWorkoutExercise } from "@/src/features/training-plans/api/create-workout-exercise";
import type { TrainingPlanWorkoutDay } from "@/src/features/training-plans/lib/training-plans.types";
import {
  createWorkoutExerciseSchema,
  type CreateWorkoutExerciseInput,
} from "@/src/features/training-plans/lib/create-workout-exercise.schema";
import { cn } from "@/src/shared/lib/utils";

type Option = {
  value: string;
  label: string;
};

type CreateWorkoutExerciseDialogProps = {
  currentUserId: number;
  day: TrainingPlanWorkoutDay;
  exerciseTypeOptions: Option[];
  muscleGroupOptions: Option[];
  triggerClassName?: string;
  labels: {
    trigger: string;
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    orderLabel: string;
    orderPlaceholder: string;
    typeLabel: string;
    muscleGroupLabel: string;
    targetSetsLabel: string;
    minRepsLabel: string;
    maxRepsLabel: string;
    targetRirLabel: string;
    weightStepLabel: string;
    targetSetsPlaceholder: string;
    minRepsPlaceholder: string;
    maxRepsPlaceholder: string;
    targetRirPlaceholder: string;
    weightStepPlaceholder: string;
    submit: string;
    submitting: string;
    cancel: string;
    success: string;
    errorFallback: string;
    unavailableTypes: string;
    unavailableMuscleGroups: string;
    fallbackType: string;
    fallbackMuscleGroup: string;
    gymCoinTitle?: string;
    gymCoinDescription?: string;
    gymCoinUnavailable?: string;
    gymCoinInsufficient?: string;
    gymCoinChecking?: string;
  };
};

export function CreateWorkoutExerciseDialog({
  currentUserId,
  day,
  exerciseTypeOptions,
  muscleGroupOptions,
  triggerClassName,
  labels,
}: CreateWorkoutExerciseDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const hasExerciseTypes = exerciseTypeOptions.length > 0;
  const hasMuscleGroups = muscleGroupOptions.length > 0;
  const hasGymCoinGuard = Boolean(labels.gymCoinTitle);
  const accessQuery = useGymCoinFeatureAccess(
    currentUserId,
    GYMCOIN_FEATURES.createExercise,
    isOpen && hasGymCoinGuard,
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateWorkoutExerciseInput>({
    defaultValues: {
      name: "",
      description: "",
      order: 1,
      type: exerciseTypeOptions[0]?.value ?? "",
      muscleGroup: muscleGroupOptions[0]?.value ?? "",
      targetSets: 4,
      minReps: 6,
      maxReps: 10,
      targetRir: 2,
      weightStep: 2.5,
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: CreateWorkoutExerciseInput) =>
      createWorkoutExercise(day.id, payload),
    onSuccess: async () => {
      await refreshGymCoinWallet(queryClient, currentUserId);

      startTransition(() => {
        setIsOpen(false);
        setFormError(null);
        reset({
          name: "",
          description: "",
          order: 1,
          type: exerciseTypeOptions[0]?.value ?? "",
          muscleGroup: muscleGroupOptions[0]?.value ?? "",
          targetSets: 4,
          minReps: 6,
          maxReps: 10,
          targetRir: 2,
          weightStep: 2.5,
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
    if (hasGymCoinGuard) {
      const access = await accessQuery.refetch();

      if (!access.data?.allowed) {
        setFormError(
          access.data?.message ?? labels.gymCoinUnavailable ?? labels.errorFallback,
        );
        return;
      }
    }

    const parsed = createWorkoutExerciseSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      if (fieldErrors.name?.[0]) setError("name", { message: fieldErrors.name[0] });
      if (fieldErrors.description?.[0]) {
        setError("description", { message: fieldErrors.description[0] });
      }
      if (fieldErrors.order?.[0]) setError("order", { message: fieldErrors.order[0] });
      if (fieldErrors.type?.[0]) setError("type", { message: fieldErrors.type[0] });
      if (fieldErrors.muscleGroup?.[0]) {
        setError("muscleGroup", { message: fieldErrors.muscleGroup[0] });
      }
      if (fieldErrors.targetSets?.[0]) {
        setError("targetSets", { message: fieldErrors.targetSets[0] });
      }
      if (fieldErrors.minReps?.[0]) {
        setError("minReps", { message: fieldErrors.minReps[0] });
      }
      if (fieldErrors.maxReps?.[0]) {
        setError("maxReps", { message: fieldErrors.maxReps[0] });
      }
      if (fieldErrors.targetRir?.[0]) {
        setError("targetRir", { message: fieldErrors.targetRir[0] });
      }
      if (fieldErrors.weightStep?.[0]) {
        setError("weightStep", { message: fieldErrors.weightStep[0] });
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
            description: "",
            order: 1,
            type: exerciseTypeOptions[0]?.value ?? "",
            muscleGroup: muscleGroupOptions[0]?.value ?? "",
            targetSets: 4,
            minReps: 6,
            maxReps: 10,
            targetRir: 2,
            weightStep: 2.5,
          });
          setFormError(null);
          setIsOpen(true);
        }}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-xl bg-[#1cc31c] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#27d927]",
          triggerClassName,
        )}
      >
        {labels.trigger}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-3xl rounded-[24px] border border-white/8 bg-[#090909] p-6 shadow-[0_24px_120px_rgba(0,0,0,0.42)]">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold text-white">{labels.title}</h2>
              <p className="text-sm text-white/48">{labels.description}</p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              {hasGymCoinGuard ? (
                <GymCoinFeatureAccessPanel
                  title={labels.gymCoinTitle ?? ""}
                  description={labels.gymCoinDescription ?? ""}
                  checkingLabel={labels.gymCoinChecking ?? labels.submitting}
                  insufficientLabel={labels.gymCoinInsufficient ?? labels.errorFallback}
                  unavailableLabel={labels.gymCoinUnavailable ?? labels.errorFallback}
                  requiredCoins={
                    accessQuery.data?.requiredCoins ??
                    DEFAULT_GYMCOIN_COSTS[GYMCOIN_FEATURES.createExercise]
                  }
                  allowed={accessQuery.data?.allowed}
                  missingCoins={accessQuery.data?.missingCoins ?? 0}
                  balance={accessQuery.data?.currentBalance ?? null}
                  isLoading={accessQuery.isLoading || accessQuery.isFetching}
                />
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={labels.nameLabel} htmlFor={`exercise-name-${day.id}`}>
                  <input
                    id={`exercise-name-${day.id}`}
                    type="text"
                    placeholder={labels.namePlaceholder}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                    {...register("name")}
                  />
                  {errors.name?.message ? <ErrorText>{errors.name.message}</ErrorText> : null}
                </Field>

                <Field label={labels.orderLabel} htmlFor={`exercise-order-${day.id}`}>
                  <input
                    id={`exercise-order-${day.id}`}
                    type="number"
                    min="1"
                    placeholder={labels.orderPlaceholder}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                    {...register("order", { valueAsNumber: true })}
                  />
                  {errors.order?.message ? <ErrorText>{errors.order.message}</ErrorText> : null}
                </Field>
              </div>

              <Field label={labels.descriptionLabel} htmlFor={`exercise-description-${day.id}`}>
                <textarea
                  id={`exercise-description-${day.id}`}
                  rows={3}
                  placeholder={labels.descriptionPlaceholder}
                  className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                  {...register("description")}
                />
                {errors.description?.message ? (
                  <ErrorText>{errors.description.message}</ErrorText>
                ) : null}
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={labels.typeLabel} htmlFor={`exercise-type-${day.id}`}>
                  <select
                    id={`exercise-type-${day.id}`}
                    disabled={!hasExerciseTypes}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10 disabled:opacity-60"
                    {...register("type")}
                  >
                    {hasExerciseTypes ? (
                      exerciseTypeOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-[#090909] text-white">
                          {option.label}
                        </option>
                      ))
                    ) : (
                      <option value="" className="bg-[#090909] text-white">
                        {labels.fallbackType}
                      </option>
                    )}
                  </select>
                  {!hasExerciseTypes ? <ErrorText>{labels.unavailableTypes}</ErrorText> : null}
                  {errors.type?.message ? <ErrorText>{errors.type.message}</ErrorText> : null}
                </Field>

                <Field label={labels.muscleGroupLabel} htmlFor={`exercise-muscle-${day.id}`}>
                  <select
                    id={`exercise-muscle-${day.id}`}
                    disabled={!hasMuscleGroups}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10 disabled:opacity-60"
                    {...register("muscleGroup")}
                  >
                    {hasMuscleGroups ? (
                      muscleGroupOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-[#090909] text-white">
                          {option.label}
                        </option>
                      ))
                    ) : (
                      <option value="" className="bg-[#090909] text-white">
                        {labels.fallbackMuscleGroup}
                      </option>
                    )}
                  </select>
                  {!hasMuscleGroups ? (
                    <ErrorText>{labels.unavailableMuscleGroups}</ErrorText>
                  ) : null}
                  {errors.muscleGroup?.message ? (
                    <ErrorText>{errors.muscleGroup.message}</ErrorText>
                  ) : null}
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <Field label={labels.targetSetsLabel} htmlFor={`exercise-sets-${day.id}`}>
                  <input
                    id={`exercise-sets-${day.id}`}
                    type="number"
                    min="1"
                    placeholder={labels.targetSetsPlaceholder}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                    {...register("targetSets", { valueAsNumber: true })}
                  />
                  {errors.targetSets?.message ? <ErrorText>{errors.targetSets.message}</ErrorText> : null}
                </Field>
                <Field label={labels.minRepsLabel} htmlFor={`exercise-min-reps-${day.id}`}>
                  <input
                    id={`exercise-min-reps-${day.id}`}
                    type="number"
                    min="1"
                    placeholder={labels.minRepsPlaceholder}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                    {...register("minReps", { valueAsNumber: true })}
                  />
                  {errors.minReps?.message ? <ErrorText>{errors.minReps.message}</ErrorText> : null}
                </Field>
                <Field label={labels.maxRepsLabel} htmlFor={`exercise-max-reps-${day.id}`}>
                  <input
                    id={`exercise-max-reps-${day.id}`}
                    type="number"
                    min="1"
                    placeholder={labels.maxRepsPlaceholder}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                    {...register("maxReps", { valueAsNumber: true })}
                  />
                  {errors.maxReps?.message ? <ErrorText>{errors.maxReps.message}</ErrorText> : null}
                </Field>
                <Field label={labels.targetRirLabel} htmlFor={`exercise-rir-${day.id}`}>
                  <input
                    id={`exercise-rir-${day.id}`}
                    type="number"
                    min="0"
                    placeholder={labels.targetRirPlaceholder}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                    {...register("targetRir", { valueAsNumber: true })}
                  />
                  {errors.targetRir?.message ? <ErrorText>{errors.targetRir.message}</ErrorText> : null}
                </Field>
                <Field label={labels.weightStepLabel} htmlFor={`exercise-weight-step-${day.id}`}>
                  <input
                    id={`exercise-weight-step-${day.id}`}
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder={labels.weightStepPlaceholder}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                    {...register("weightStep", { valueAsNumber: true })}
                  />
                  {errors.weightStep?.message ? <ErrorText>{errors.weightStep.message}</ErrorText> : null}
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
                  disabled={
                    mutation.isPending ||
                    isPending ||
                    !hasExerciseTypes ||
                    !hasMuscleGroups ||
                    (hasGymCoinGuard && accessQuery.isLoading) ||
                    accessQuery.data?.allowed === false
                  }
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1cc31c] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#27d927] disabled:opacity-60"
                >
                  {mutation.isPending || isPending ? labels.submitting : labels.submit}
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

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[#ff7b72]">{children}</p>;
}
