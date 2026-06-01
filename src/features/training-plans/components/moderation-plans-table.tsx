import { ModerationPlanActions } from "./moderation-plan-actions";
import { getDisplayNameFromEmail } from "@/src/features/dashboard/lib/dashboard.utils";

import type { PendingTrainingPlan } from "../lib/training-plans.types";

type ModerationPlansTableProps = {
  plans: PendingTrainingPlan[];
  labels: {
    title: string;
    description: string;
    id: string;
    titleColumn: string;
    status: string;
    author: string;
    email: string;
    actions: string;
    empty: string;
    pending: string;
    actionButtons: {
      approve: string;
      approving: string;
      reject: string;
      rejectTitle: string;
      rejectDescription: string;
      rejectReason: string;
      rejectReasonPlaceholder: string;
      submitReject: string;
      rejecting: string;
      cancel: string;
      approveSuccess: string;
      rejectSuccess: string;
      errorFallback: string;
    };
  };
};

export function ModerationPlansTable({
  plans,
  labels,
}: ModerationPlansTableProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6">
        <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
        <p className="mt-1 text-lg text-white/42">{labels.description}</p>
      </div>

      <div className="overflow-x-auto rounded-[18px] border border-white/8">
        <table className="min-w-full divide-y divide-white/8">
          <thead className="bg-white/[0.03]">
            <tr className="text-left text-sm text-white/45">
              <th className="px-4 py-3 font-medium">{labels.id}</th>
              <th className="px-4 py-3 font-medium">{labels.titleColumn}</th>
              <th className="px-4 py-3 font-medium">{labels.status}</th>
              <th className="px-4 py-3 font-medium">{labels.author}</th>
              <th className="px-4 py-3 font-medium">{labels.email}</th>
              <th className="px-4 py-3 font-medium">{labels.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8 bg-black/20">
            {plans.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-white/45">
                  {labels.empty}
                </td>
              </tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan.id} className="text-sm text-white/86">
                  <td className="px-4 py-4">{plan.id}</td>
                  <td className="px-4 py-4 font-medium text-white">{plan.title}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full border border-[#facc15]/20 bg-[#facc15]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#fde68a]">
                      {labels.pending}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-white/68">
                    {getDisplayNameFromEmail(plan.author.email)}
                  </td>
                  <td className="px-4 py-4 text-white/58">{plan.author.email}</td>
                  <td className="px-4 py-4">
                    <ModerationPlanActions
                      plan={plan}
                      labels={labels.actionButtons}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
