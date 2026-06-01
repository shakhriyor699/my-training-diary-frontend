import { formatDateLabel } from "@/src/features/dashboard/lib/dashboard.utils";

import { CreateCoachRequestDialog } from "./create-coach-request-dialog";
import type { Coach } from "../lib/coaches.types";

type CoachesListProps = {
  coaches: Coach[];
  labels: {
    title: string;
    description: string;
    empty: string;
    total: string;
    email: string;
    role: string;
    createdAt: string;
    coachRole: string;
    request: {
      trigger: string;
      title: string;
      description: string;
      messageLabel: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
      cancel: string;
      success: string;
      errorFallback: string;
    };
  };
};

export function CoachesList({ coaches, labels }: CoachesListProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
          <p className="mt-1 text-lg text-white/42">{labels.description}</p>
        </div>

        <div className="inline-flex rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/72">
          {labels.total}: {coaches.length}
        </div>
      </div>

      {coaches.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
          {labels.empty}
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {coaches.map((coach) => (
            <article
              key={coach.id}
              className="rounded-[20px] border border-white/8 bg-black/20 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
                      ID {coach.id}
                    </span>
                    <span className="inline-flex rounded-full border border-[#d8f76d]/16 bg-[#d8f76d]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#e8f9a7]">
                      {labels.coachRole}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      {coach.name}
                    </h3>
                    <p className="mt-2 text-sm text-white/58">{coach.email}</p>
                  </div>
                </div>

                <div className="grid min-w-[240px] gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] p-4 text-sm text-white/64">
                  <Metric label={labels.email} value={coach.email} />
                  <Metric label={labels.role} value={labels.coachRole} />
                  <Metric label={labels.createdAt} value={formatDateLabel(coach.createdAt)} />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <CreateCoachRequestDialog coach={coach} labels={labels.request} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-white/36">{label}</p>
      <p className="mt-1 text-base font-semibold text-white">{value}</p>
    </div>
  );
}
