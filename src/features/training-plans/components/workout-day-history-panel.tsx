import { formatMuscleGroup } from "@/src/features/dashboard/lib/dashboard.utils";

import {
  buildWorkoutDayHistoryTables,
  type WorkoutDayHistoryTable,
} from "../lib/workout-day-history.utils";
import type { WorkoutDayHistoryResponse } from "../lib/training-plans.types";

type WorkoutDayHistoryPanelProps = {
  locale: string;
  history: WorkoutDayHistoryResponse;
  labels: {
    title: string;
    description: string;
    empty: string;
    date: string;
    notes: string;
    set: string;
    target: string;
    type: string;
    muscleGroup: string;
    noNotes: string;
  };
};

export function WorkoutDayHistoryPanel({
  locale,
  history,
  labels,
}: WorkoutDayHistoryPanelProps) {
  const tables = buildWorkoutDayHistoryTables(history);

  if (tables.length === 0) {
    return (
      <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
        <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
          {labels.empty}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
            <p className="mt-1 text-lg text-white/42">{labels.description}</p>
          </div>

          <div className="inline-flex rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/72">
            {history.workoutDay.planTitle} / {history.workoutDay.title}
          </div>
        </div>

        <div className="space-y-6">
          {tables.map((table) => (
            <ExerciseHistoryTable
              key={table.exerciseId}
              locale={locale}
              table={table}
              labels={labels}
            />
          ))}
        </div>
      </section>
    </section>
  );
}

function ExerciseHistoryTable({
  locale,
  table,
  labels,
}: {
  locale: string;
  table: WorkoutDayHistoryTable;
  labels: WorkoutDayHistoryPanelProps["labels"];
}) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-white/8 bg-black/18">
      <div className="border-b border-white/8 px-5 py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-white">{table.exerciseName}</h3>
            {table.description ? (
              <p className="mt-2 text-sm leading-6 text-white/58">{table.description}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <MetaBadge label={labels.target} value={table.targetLabel} />
            <MetaBadge label={labels.type} value={formatMuscleGroup(table.type)} />
            <MetaBadge label={labels.muscleGroup} value={formatMuscleGroup(table.muscleGroup)} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto px-5 py-5">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.14em] text-white/36">
              <th className="px-4">{labels.date}</th>
              {Array.from({ length: table.maxSets }, (_, index) => (
                <th key={index} className="px-4">
                  {labels.set} {index + 1}
                </th>
              ))}
              <th className="px-4">{labels.notes}</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, index) => (
              <tr
                key={`${table.exerciseId}-${row.date}-${index}`}
                className="rounded-2xl bg-[#0a0a0a] text-sm text-white/74"
              >
                <td className="rounded-l-2xl border-y border-l border-white/8 px-4 py-3 whitespace-nowrap">
                  {formatHistoryDate(row.date, locale)}
                </td>
                {row.setLabels.map((label, setIndex) => (
                  <td key={setIndex} className="border-y border-white/8 px-4 py-3 whitespace-nowrap">
                    {label}
                  </td>
                ))}
                <td className="rounded-r-2xl border-y border-r border-white/8 px-4 py-3 text-white/64">
                  {row.note || labels.noNotes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function MetaBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60">
      {label}: {value}
    </span>
  );
}

function formatHistoryDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
