import Link from "next/link";

import { CreateTrainingPlanDialog } from "./create-training-plan-dialog";
import { EditTrainingPlanDialog } from "./edit-training-plan-dialog";
import {
  canManageTrainingPlan,
  isCoachAssignedTrainingPlan,
} from "../lib/training-plan-access";
import type { MyTrainingPlan } from "../lib/training-plans.types";

type MyTrainingPlansListProps = {
  currentUserId: number;
  locale: string;
  plans: MyTrainingPlan[];
  goalOptions: Array<{
    value: string;
    label: string;
  }>;
  labels: {
    title: string;
    description: string;
    empty: string;
    browsePublic: string;
    id: string;
    status: string;
    rejectionReason: string;
    noReason: string;
    managedByCoach: string;
    managedByCoachDescription: string;
    edit: {
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
    statuses: {
      pending: string;
      approved: string;
      rejected: string;
    };
    create: {
      trigger: string;
      title: string;
      description: string;
      gymCoinTitle?: string;
      gymCoinDescription?: string;
      gymCoinUnavailable?: string;
      gymCoinInsufficient?: string;
      gymCoinChecking?: string;
      titleLabel: string;
      titlePlaceholder: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      goalLabel: string;
      deloadAfterWeeksLabel: string;
      deloadPercentLabel: string;
      deloadAfterWeeksPlaceholder: string;
      deloadPercentPlaceholder: string;
      submit: string;
      submitting: string;
      cancel: string;
      success: string;
      errorFallback: string;
      unavailableGoals: string;
      fallbackGoal: string;
    };
  };
};

export function MyTrainingPlansList({
  currentUserId,
  locale,
  plans,
  goalOptions,
  labels,
}: MyTrainingPlansListProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
          <p className="mt-1 text-lg text-white/42">{labels.description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${locale}/training-plans`}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            {labels.browsePublic}
          </Link>
          <CreateTrainingPlanDialog
            currentUserId={currentUserId}
            goalOptions={goalOptions}
            labels={labels.create}
          />
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
          {labels.empty}
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => {
            const isCoachAssigned = isCoachAssignedTrainingPlan(plan, currentUserId);
            const canManage = canManageTrainingPlan(plan, currentUserId);

            return (
            <article
              key={plan.id}
              className="rounded-[20px] border border-white/8 bg-black/20 p-5"
            >
              {isCoachAssigned ? (
                <div className="mb-4 rounded-[16px] border border-[#39d353]/16 bg-[#39d353]/8 px-4 py-3 text-sm text-white/76">
                  <p className="font-medium text-[#a9f2a7]">
                    {labels.managedByCoach}
                  </p>
                  <p className="mt-1 text-white/64">
                    {labels.managedByCoachDescription}
                  </p>
                </div>
              ) : null}

              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
                      {labels.id} {plan.id}
                    </span>
                    <StatusBadge status={plan.status} labels={labels.statuses} />
                    {canManage ? (
                      <EditTrainingPlanDialog plan={plan} labels={labels.edit} />
                    ) : null}
                  </div>

                  <h3 className="text-2xl font-semibold text-white">{plan.title}</h3>
                </div>

                <div className="min-w-[280px] rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/36">
                    {labels.rejectionReason}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    {plan.rejectionReason ?? labels.noReason}
                  </p>
                </div>
              </div>
            </article>
          );
          })}
        </div>
      )}
    </section>
  );
}

function StatusBadge({
  status,
  labels,
}: {
  status: MyTrainingPlan["status"];
  labels: MyTrainingPlansListProps["labels"]["statuses"];
}) {
  const text = labels[status];
  const className =
    status === "approved"
      ? "border-[#39d353]/20 bg-[#39d353]/10 text-[#7ee787]"
      : status === "rejected"
        ? "border-[#ff6b5d]/20 bg-[#ff6b5d]/10 text-[#ff9b90]"
        : "border-[#facc15]/20 bg-[#facc15]/10 text-[#fde68a]";

  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
        className,
      ].join(" ")}
    >
      {text}
    </span>
  );
}
