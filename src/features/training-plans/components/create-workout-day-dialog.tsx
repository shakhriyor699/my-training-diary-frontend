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
import { createWorkoutDay } from "@/src/features/training-plans/api/create-workout-day";
import type { MyTrainingPlan } from "@/src/features/training-plans/lib/training-plans.types";
import {
  createWorkoutDaySchema,
  type CreateWorkoutDayInput,
} from "@/src/features/training-plans/lib/create-workout-day.schema";
import { cn } from "@/src/shared/lib/utils";

type CreateWorkoutDayDialogProps = {
  currentUserId: number;
  plan: MyTrainingPlan;
  triggerClassName?: string;
  labels: {
    trigger: string;
    title: string;
    description: string;
    titleLabel: string;
    titlePlaceholder: string;
    orderLabel: string;
    orderPlaceholder: string;
    submit: string;
    submitting: string;
    cancel: string;
    success: string;
    errorFallback: string;
    gymCoinTitle?: string;
    gymCoinDescription?: string;
    gymCoinUnavailable?: string;
    gymCoinInsufficient?: string;
    gymCoinChecking?: string;
  };
};

export function CreateWorkoutDayDialog({
  currentUserId,
  plan,
  triggerClassName,
  labels,
}: CreateWorkoutDayDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const hasGymCoinGuard = Boolean(labels.gymCoinTitle);
  const accessQuery = useGymCoinFeatureAccess(
    currentUserId,
    GYMCOIN_FEATURES.createWorkoutDay,
    isOpen && hasGymCoinGuard,
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateWorkoutDayInput>({
    defaultValues: {
      title: "",
      order: 1,
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: CreateWorkoutDayInput) =>
      createWorkoutDay(plan.id, payload),
    onSuccess: async () => {
      await refreshGymCoinWallet(queryClient, currentUserId);

      startTransition(() => {
        setIsOpen(false);
        setFormError(null);
        reset({
          title: "",
          order: 1,
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

    const parsed = createWorkoutDaySchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      if (fieldErrors.title?.[0]) {
        setError("title", { message: fieldErrors.title[0] });
      }

      if (fieldErrors.order?.[0]) {
        setError("order", { message: fieldErrors.order[0] });
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
            title: "",
            order: 1,
          });
          setFormError(null);
          setIsOpen(true);
        }}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-xl bg-[#1cc31c] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#27d927]",
          triggerClassName,
        )}
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
              {hasGymCoinGuard ? (
                <GymCoinFeatureAccessPanel
                  title={labels.gymCoinTitle ?? ""}
                  description={labels.gymCoinDescription ?? ""}
                  checkingLabel={labels.gymCoinChecking ?? labels.submitting}
                  insufficientLabel={labels.gymCoinInsufficient ?? labels.errorFallback}
                  unavailableLabel={labels.gymCoinUnavailable ?? labels.errorFallback}
                  requiredCoins={
                    accessQuery.data?.requiredCoins ??
                    DEFAULT_GYMCOIN_COSTS[GYMCOIN_FEATURES.createWorkoutDay]
                  }
                  allowed={accessQuery.data?.allowed}
                  missingCoins={accessQuery.data?.missingCoins ?? 0}
                  balance={accessQuery.data?.currentBalance ?? null}
                  isLoading={accessQuery.isLoading || accessQuery.isFetching}
                />
              ) : null}

              <Field label={labels.titleLabel} htmlFor={`create-day-title-${plan.id}`}>
                <input
                  id={`create-day-title-${plan.id}`}
                  type="text"
                  placeholder={labels.titlePlaceholder}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                  {...register("title")}
                />
                {errors.title?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.title.message}</p>
                ) : null}
              </Field>

              <Field label={labels.orderLabel} htmlFor={`create-day-order-${plan.id}`}>
                <input
                  id={`create-day-order-${plan.id}`}
                  type="number"
                  min="1"
                  placeholder={labels.orderPlaceholder}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                  {...register("order", { valueAsNumber: true })}
                />
                {errors.order?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.order.message}</p>
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
                  disabled={
                    mutation.isPending ||
                    isPending ||
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
