import Link from "next/link";

import {
  formatDateLabel,
  formatInteger,
} from "@/src/features/dashboard/lib/dashboard.utils";
import { toCoachStudentSessionsSearchParams } from "@/src/features/coaches/lib/coach-student-sessions.query";

import type {
  CoachStudentSessionsQuery,
  CoachStudentSessionsResponse,
} from "../lib/coach-student-sessions.types";

type CoachStudentSessionsListProps = {
  locale: string;
  studentId: number;
  response: CoachStudentSessionsResponse;
  query: CoachStudentSessionsQuery;
  labels: {
    title: string;
    description: string;
    empty: string;
    page: string;
    previous: string;
    next: string;
    plan: string;
    date: string;
    totalSets: string;
    totalVolume: string;
    setLogs: string;
    set: string;
    weight: string;
    reps: string;
    rir: string;
    exercise: string;
    muscleGroup: string;
  };
};

export function CoachStudentSessionsList({
  locale,
  studentId,
  response,
  query,
  labels,
}: CoachStudentSessionsListProps) {
  const previousPage = Math.max(response.meta.page - 1, 1);
  const nextPage = Math.min(response.meta.page + 1, response.meta.totalPages);

  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6">
        <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
        <p className="mt-1 text-lg text-white/42">{labels.description}</p>
      </div>

      {response.data.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
          {labels.empty}
        </div>
      ) : (
        <div className="space-y-4">
          {response.data.map((session) => {
            const setLogs = session.setLogs ?? [];
            const totalVolume = setLogs.reduce(
              (sum, setLog) => sum + setLog.weight * setLog.reps,
              0,
            );
            const totalSets = setLogs.length;

            return (
              <article
                key={session.id}
                className="rounded-[20px] border border-white/8 bg-black/20 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
                        ID {session.id}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-white">
                        {session.plan.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/52">
                        {labels.date}: {formatDateLabel(session.date)}
                      </p>
                    </div>
                  </div>

                  <div className="grid min-w-[260px] gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] p-4 text-sm text-white/64">
                    <Metric label={labels.plan} value={`#${session.plan.id}`} />
                    <Metric label={labels.totalSets} value={formatInteger(totalSets)} />
                    <Metric label={labels.totalVolume} value={formatInteger(totalVolume)} />
                  </div>
                </div>

                <div className="mt-5 rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/36">
                    {labels.setLogs}
                  </p>

                  <div className="mt-3 space-y-3">
                    {setLogs.map((setLog) => (
                      <div
                        key={setLog.id}
                        className="rounded-2xl border border-white/8 bg-black/20 p-4"
                      >
                        <div className="flex flex-col gap-4">
                          <div>
                            <p className="font-medium text-white">
                              {setLog.exercise.name}
                            </p>
                            <div className="mt-1 flex flex-wrap gap-3 text-sm text-white/48">
                              <span>
                                {labels.exercise}: #{setLog.exercise.id}
                              </span>
                              <span>
                                {labels.muscleGroup}: {setLog.exercise.muscleGroup}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3 text-sm text-white/62 sm:flex-row sm:items-center sm:justify-between">
                            <p>
                              {labels.set} #{setLog.setNumber}
                            </p>
                            <div className="flex flex-wrap gap-3 sm:justify-end">
                              <span>
                                {labels.weight}: {setLog.weight}
                              </span>
                              <span>
                                {labels.reps}: {setLog.reps}
                              </span>
                              <span>
                                {labels.rir}: {setLog.rir}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/45">
          {labels.page} {response.meta.page} / {response.meta.totalPages}
        </p>
        <div className="flex gap-2">
          <PaginationLink
            locale={locale}
            studentId={studentId}
            query={{ ...query, page: previousPage }}
            disabled={response.meta.page <= 1}
            label={labels.previous}
          />
          <PaginationLink
            locale={locale}
            studentId={studentId}
            query={{ ...query, page: nextPage }}
            disabled={response.meta.page >= response.meta.totalPages}
            label={labels.next}
          />
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-white/36">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function PaginationLink({
  locale,
  studentId,
  query,
  disabled,
  label,
}: {
  locale: string;
  studentId: number;
  query: CoachStudentSessionsQuery;
  disabled: boolean;
  label: string;
}) {
  const href = `/${locale}/dashboard/my-coach/students/${studentId}/sessions?${toCoachStudentSessionsSearchParams(query)}`;

  if (disabled) {
    return (
      <span className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm text-white/28">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
    >
      {label}
    </Link>
  );
}
