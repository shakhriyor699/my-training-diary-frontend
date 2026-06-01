import { formatInteger } from "@/src/features/dashboard/lib/dashboard.utils";

import type { PendingTrainingPlan } from "../lib/training-plans.types";

type ModerationStatsStripProps = {
  plans: PendingTrainingPlan[];
  labels: {
    total: string;
    authors: string;
    latestPlan: string;
    empty: string;
  };
};

export function ModerationStatsStrip({
  plans,
  labels,
}: ModerationStatsStripProps) {
  const uniqueAuthors = new Set(plans.map((plan) => plan.author.id)).size;
  const latestPlan = plans[0]?.title ?? labels.empty;

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <StatCard label={labels.total} value={formatInteger(plans.length)} />
      <StatCard label={labels.authors} value={formatInteger(uniqueAuthors)} />
      <StatCard label={labels.latestPlan} value={latestPlan} />
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-[#070707] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.2)]">
      <p className="text-sm text-white/42">{label}</p>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}
