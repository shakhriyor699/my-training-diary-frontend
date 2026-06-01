import {
  formatDateLabel,
  getDisplayNameFromEmail,
} from "@/src/features/dashboard/lib/dashboard.utils";
import Link from "next/link";

import type { CoachStudent } from "../lib/coach-students.types";

type CoachStudentsListProps = {
  locale: string;
  students: CoachStudent[];
  labels: {
    title: string;
    description: string;
    empty: string;
    total: string;
    student: string;
    email: string;
    role: string;
    createdAt: string;
    accepted: string;
    viewStats: string;
    viewSessions: string;
  };
};

export function CoachStudentsList({
  locale,
  students,
  labels,
}: CoachStudentsListProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
          <p className="mt-1 text-lg text-white/42">{labels.description}</p>
        </div>

        <div className="inline-flex rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/72">
          {labels.total}: {students.length}
        </div>
      </div>

      {students.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
          {labels.empty}
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {students.map((studentLink) => (
            <article
              key={studentLink.id}
              className="rounded-[20px] border border-white/8 bg-black/20 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
                      ID {studentLink.id}
                    </span>
                    <span className="inline-flex rounded-full border border-[#39d353]/18 bg-[#39d353]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#a9f2a7]">
                      {labels.accepted}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      {getDisplayNameFromEmail(studentLink.student.email)}
                    </h3>
                    <p className="mt-2 text-sm text-white/58">
                      {studentLink.student.email}
                    </p>
                  </div>
                </div>

                <div className="grid min-w-[240px] gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] p-4 text-sm text-white/64">
                  <Metric
                    label={labels.student}
                    value={getDisplayNameFromEmail(studentLink.student.email)}
                  />
                  <Metric label={labels.email} value={studentLink.student.email} />
                  <Metric label={labels.role} value={studentLink.student.role} />
                  <Metric
                    label={labels.createdAt}
                    value={formatDateLabel(studentLink.student.createdAt)}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-3">
                <Link
                  href={`/${locale}/dashboard/my-coach/students/${studentLink.studentId}`}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {labels.viewStats}
                </Link>
                <Link
                  href={`/${locale}/dashboard/my-coach/students/${studentLink.studentId}/sessions`}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {labels.viewSessions}
                </Link>
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
