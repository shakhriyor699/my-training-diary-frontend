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
import {
  createTrainingPlanSchema,
  type CreateTrainingPlanInput,
} from "@/src/features/training-plans/lib/create-training-plan.schema";
import type {
  CreateTrainingPlanMutation,
  TrainingPlanFormLabels,
  TrainingPlanGoalOption,
} from "@/src/features/training-plans/lib/training-plan-form.types";

type TrainingPlanFormDialogProps = {
  currentUserId: number;
  goalOptions: TrainingPlanGoalOption[];
  labels: TrainingPlanFormLabels;
  onSubmitPlan: CreateTrainingPlanMutation;
};

const defaultValues: CreateTrainingPlanInput = {
  title: "",
  description: "",
  goal: "",
  deloadAfterWeeks: 6,
  deloadPercent: 10,
};

export function TrainingPlanFormDialog({
  currentUserId,
  goalOptions,
  labels,
  onSubmitPlan,
}: TrainingPlanFormDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const hasGoals = goalOptions.length > 0;
  const initialGoal = goalOptions[0]?.value ?? "";
  const hasGymCoinGuard = Boolean(labels.gymCoinTitle);
  const accessQuery = useGymCoinFeatureAccess(
    currentUserId,
    GYMCOIN_FEATURES.createTrainingPlan,
    isOpen && hasGymCoinGuard,
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateTrainingPlanInput>({
    defaultValues: {
      ...defaultValues,
      goal: initialGoal,
    },
  });

  const mutation = useMutation({
    mutationFn: onSubmitPlan,
    onSuccess: async () => {
      await refreshGymCoinWallet(queryClient, currentUserId);

      startTransition(() => {
        setIsOpen(false);
        setFormError(null);
        reset({
          ...defaultValues,
          goal: initialGoal,
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

    const parsed = createTrainingPlanSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      if (fieldErrors.title?.[0]) {
        setError("title", { message: fieldErrors.title[0] });
      }

      if (fieldErrors.description?.[0]) {
        setError("description", { message: fieldErrors.description[0] });
      }

      if (fieldErrors.goal?.[0]) {
        setError("goal", { message: fieldErrors.goal[0] });
      }

      if (fieldErrors.deloadAfterWeeks?.[0]) {
        setError("deloadAfterWeeks", {
          message: fieldErrors.deloadAfterWeeks[0],
        });
      }

      if (fieldErrors.deloadPercent?.[0]) {
        setError("deloadPercent", {
          message: fieldErrors.deloadPercent[0],
        });
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
        className="inline-flex h-12 items-center justify-center rounded-xl bg-[#1cc31c] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#27d927]"
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
              {hasGymCoinGuard ? (
                <GymCoinFeatureAccessPanel
                  title={labels.gymCoinTitle ?? ""}
                  description={labels.gymCoinDescription ?? ""}
                  checkingLabel={labels.gymCoinChecking ?? labels.submitting}
                  insufficientLabel={labels.gymCoinInsufficient ?? labels.errorFallback}
                  unavailableLabel={labels.gymCoinUnavailable ?? labels.errorFallback}
                  requiredCoins={
                    accessQuery.data?.requiredCoins ??
                    DEFAULT_GYMCOIN_COSTS[GYMCOIN_FEATURES.createTrainingPlan]
                  }
                  allowed={accessQuery.data?.allowed}
                  missingCoins={accessQuery.data?.missingCoins ?? 0}
                  balance={accessQuery.data?.currentBalance ?? null}
                  isLoading={accessQuery.isLoading || accessQuery.isFetching}
                />
              ) : null}

              <Field label={labels.titleLabel} htmlFor="training-plan-title">
                <input
                  id="training-plan-title"
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
                htmlFor="training-plan-description"
              >
                <textarea
                  id="training-plan-description"
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

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label={labels.goalLabel} htmlFor="training-plan-goal">
                  <select
                    id="training-plan-goal"
                    disabled={!hasGoals}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10 disabled:opacity-60"
                    {...register("goal")}
                  >
                    {hasGoals ? (
                      goalOptions.map((goalOption) => (
                        <option
                          key={goalOption.value}
                          value={goalOption.value}
                          className="bg-[#090909] text-white"
                        >
                          {goalOption.label}
                        </option>
                      ))
                    ) : (
                      <option value="" className="bg-[#090909] text-white">
                        {labels.fallbackGoal}
                      </option>
                    )}
                  </select>
                  {!hasGoals ? (
                    <p className="text-sm text-[#ff7b72]">
                      {labels.unavailableGoals}
                    </p>
                  ) : null}
                  {errors.goal?.message ? (
                    <p className="text-sm text-[#ff7b72]">{errors.goal.message}</p>
                  ) : null}
                </Field>

                <Field
                  label={labels.deloadAfterWeeksLabel}
                  htmlFor="training-plan-deload-weeks"
                >
                  <input
                    id="training-plan-deload-weeks"
                    type="number"
                    min="1"
                    placeholder={labels.deloadAfterWeeksPlaceholder}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                    {...register("deloadAfterWeeks", { valueAsNumber: true })}
                  />
                  {errors.deloadAfterWeeks?.message ? (
                    <p className="text-sm text-[#ff7b72]">
                      {errors.deloadAfterWeeks.message}
                    </p>
                  ) : null}
                </Field>

                <Field
                  label={labels.deloadPercentLabel}
                  htmlFor="training-plan-deload-percent"
                >
                  <input
                    id="training-plan-deload-percent"
                    type="number"
                    min="0"
                    max="100"
                    placeholder={labels.deloadPercentPlaceholder}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                    {...register("deloadPercent", { valueAsNumber: true })}
                  />
                  {errors.deloadPercent?.message ? (
                    <p className="text-sm text-[#ff7b72]">
                      {errors.deloadPercent.message}
                    </p>
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
                  disabled={
                    mutation.isPending ||
                    isPending ||
                    !hasGoals ||
                    (hasGymCoinGuard && accessQuery.isLoading) ||
                    accessQuery.data?.allowed === false
                  }
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
