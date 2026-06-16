"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  getGymCoinRulesClient,
  topUpGymCoin,
  updateGymCoinRule,
} from "../api/gymcoin-client";
import { GYMCOIN_RULES_QUERY_KEY } from "../lib/gymcoin.constants";
import type { GymCoinRule, GymCoinRulesResult } from "../lib/gymcoin.types";

type GymCoinAdminPanelProps = {
  initialRules: GymCoinRulesResult;
  labels: {
    title: string;
    description: string;
    empty: string;
    feature: string;
    cost: string;
    enabled: string;
    save: string;
    saving: string;
    saveSuccess: string;
    saveErrorFallback: string;
    topUpTitle: string;
    topUpDescription: string;
    userId: string;
    userIdPlaceholder: string;
    amount: string;
    amountPlaceholder: string;
    reason: string;
    reasonPlaceholder: string;
    submitTopUp: string;
    toppingUp: string;
    topUpSuccess: string;
    topUpErrorFallback: string;
  };
};

type TopUpFormValues = {
  userId: number;
  amount: number;
  reason: string;
};

export function GymCoinAdminPanel({
  initialRules,
  labels,
}: GymCoinAdminPanelProps) {
  const queryClient = useQueryClient();
  const [savingFeature, setSavingFeature] = useState<string | null>(null);
  const rulesQuery = useQuery({
    queryKey: GYMCOIN_RULES_QUERY_KEY,
    queryFn: getGymCoinRulesClient,
    initialData: initialRules.rules,
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TopUpFormValues>({
    defaultValues: {
      userId: 0,
      amount: 0,
      reason: "",
    },
  });

  const topUpMutation = useMutation({
    mutationFn: topUpGymCoin,
    onSuccess: (response) => {
      toast.success(response.message ?? labels.topUpSuccess);
      reset({
        userId: 0,
        amount: 0,
        reason: "",
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : labels.topUpErrorFallback);
    },
  });

  const onSubmitTopUp = handleSubmit(async (values) => {
    await topUpMutation.mutateAsync({
      userId: values.userId,
      amount: values.amount,
      reason: values.reason.trim() || undefined,
    });
  });

  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6 space-y-2">
        <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
        <p className="text-lg text-white/42">{labels.description}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="space-y-4">
          {rulesQuery.data.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
              {labels.empty}
            </div>
          ) : (
            rulesQuery.data.map((rule) => (
              <RuleEditorCard
                key={rule.feature}
                rule={rule}
                labels={labels}
                isSaving={savingFeature === rule.feature}
                onSave={async (payload) => {
                  setSavingFeature(rule.feature);

                  try {
                    const updatedRules = await updateGymCoinRule(rule.feature, payload);
                    queryClient.setQueryData(GYMCOIN_RULES_QUERY_KEY, updatedRules);
                    toast.success(labels.saveSuccess);
                  } catch (error) {
                    toast.error(
                      error instanceof Error ? error.message : labels.saveErrorFallback,
                    );
                  } finally {
                    setSavingFeature(null);
                  }
                }}
              />
            ))
          )}
        </div>

        <form
          className="rounded-[20px] border border-white/8 bg-black/20 p-5"
          onSubmit={onSubmitTopUp}
        >
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">{labels.topUpTitle}</h3>
            <p className="text-sm leading-6 text-white/52">{labels.topUpDescription}</p>
          </div>

          <div className="mt-5 space-y-4">
            <Field label={labels.userId}>
              <input
                type="number"
                min="1"
                placeholder={labels.userIdPlaceholder}
                className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#f5b800]/50 focus:ring-4 focus:ring-[#f5b800]/10"
                {...register("userId", { valueAsNumber: true })}
              />
            </Field>

            <Field label={labels.amount}>
              <input
                type="number"
                min="1"
                placeholder={labels.amountPlaceholder}
                className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#f5b800]/50 focus:ring-4 focus:ring-[#f5b800]/10"
                {...register("amount", { valueAsNumber: true })}
              />
            </Field>

            <Field label={labels.reason}>
              <textarea
                rows={3}
                placeholder={labels.reasonPlaceholder}
                className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#f5b800]/50 focus:ring-4 focus:ring-[#f5b800]/10"
                {...register("reason")}
              />
            </Field>

            <button
              type="submit"
              disabled={topUpMutation.isPending || isSubmitting}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f5b800] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#ffd84d] disabled:opacity-60"
            >
              {topUpMutation.isPending || isSubmitting
                ? labels.toppingUp
                : labels.submitTopUp}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function RuleEditorCard({
  rule,
  labels,
  isSaving,
  onSave,
}: {
  rule: GymCoinRule;
  labels: GymCoinAdminPanelProps["labels"];
  isSaving: boolean;
  onSave: (payload: { cost: number; enabled: boolean }) => Promise<void>;
}) {
  const [cost, setCost] = useState(rule.cost);
  const [enabled, setEnabled] = useState(rule.enabled);

  return (
    <article className="rounded-[20px] border border-white/8 bg-black/20 p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_160px_140px_auto] lg:items-end">
        <Field label={labels.feature}>
          <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white">
            {rule.feature}
          </div>
        </Field>

        <Field label={labels.cost}>
          <input
            type="number"
            min="0"
            value={cost}
            onChange={(event) => setCost(Number(event.target.value))}
            className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#f5b800]/50 focus:ring-4 focus:ring-[#f5b800]/10"
          />
        </Field>

        <Field label={labels.enabled}>
          <label className="flex h-12 items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
              className="h-4 w-4 rounded border-white/20"
            />
            <span>{enabled ? "On" : "Off"}</span>
          </label>
        </Field>

        <button
          type="button"
          onClick={() => onSave({ cost, enabled })}
          disabled={isSaving}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#f5b800] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#ffd84d] disabled:opacity-60"
        >
          {isSaving ? labels.saving : labels.save}
        </button>
      </div>
    </article>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium text-white/72">{label}</span>
      {children}
    </label>
  );
}
