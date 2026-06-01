import {
  formatDateLabel,
  getDisplayNameFromEmail,
} from "@/src/features/dashboard/lib/dashboard.utils";

import { CoachRequestActions } from "./coach-request-actions";
import type { CoachRequest } from "../lib/coach-requests.types";

type CoachRequestsListProps = {
  requests: CoachRequest[];
  labels: {
    title: string;
    description: string;
    empty: string;
    total: string;
    student: string;
    email: string;
    status: string;
    createdAt: string;
    message: string;
    statuses: {
      pending: string;
      accepted: string;
      rejected: string;
    };
    actions: {
      accept: string;
      accepting: string;
      reject: string;
      rejecting: string;
      acceptSuccess: string;
      rejectSuccess: string;
      errorFallback: string;
    };
  };
};

export function CoachRequestsList({
  requests,
  labels,
}: CoachRequestsListProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
          <p className="mt-1 text-lg text-white/42">{labels.description}</p>
        </div>

        <div className="inline-flex rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/72">
          {labels.total}: {requests.length}
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
          {labels.empty}
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-[20px] border border-white/8 bg-black/20 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
                      ID {request.id}
                    </span>
                    <StatusBadge status={request.status} labels={labels.statuses} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      {getDisplayNameFromEmail(request.student.email)}
                    </h3>
                    <p className="mt-2 text-sm text-white/58">
                      {request.student.email}
                    </p>
                  </div>

                  <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-white/36">
                      {labels.message}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white/72">
                      {request.message}
                    </p>
                  </div>
                </div>

                <div className="grid min-w-[240px] gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] p-4 text-sm text-white/64">
                  <Metric
                    label={labels.student}
                    value={getDisplayNameFromEmail(request.student.email)}
                  />
                  <Metric label={labels.email} value={request.student.email} />
                  <Metric
                    label={labels.status}
                    value={labels.statuses[request.status as keyof typeof labels.statuses] ?? request.status}
                  />
                  <Metric
                    label={labels.createdAt}
                    value={formatDateLabel(request.createdAt)}
                  />
                </div>
              </div>

              <CoachRequestActions request={request} labels={labels.actions} />
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

function StatusBadge({
  status,
  labels,
}: {
  status: CoachRequest["status"];
  labels: CoachRequestsListProps["labels"]["statuses"];
}) {
  const text = labels[status as keyof typeof labels] ?? status;
  const className =
    status === "accepted"
      ? "border-[#39d353]/18 bg-[#39d353]/10 text-[#a9f2a7]"
      : status === "rejected"
        ? "border-[#ff6b5d]/18 bg-[#ff6b5d]/10 text-[#ffb0a8]"
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
