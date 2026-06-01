import {
  formatDateLabel,
  formatInteger,
} from "@/src/features/dashboard/lib/dashboard.utils";

import { ExerciseProgressSummaryChart } from "./exercise-progress-summary-chart";
import type {
  ExerciseProgressResponse,
  ExerciseProgressSummaryResponse,
} from "../lib/training-plans.types";

type ExerciseProgressPanelProps = {
  exerciseName: string;
  progress: ExerciseProgressResponse;
  summary: ExerciseProgressSummaryResponse;
  labels: {
    title: string;
    description: string;
    summaryTitle: string;
    summaryDescription: string;
    historyTitle: string;
    historyDescription: string;
    noSelection: string;
    empty: string;
    chartEmpty: string;
    date: string;
    setNumber: string;
    weight: string;
    reps: string;
    rir: string;
    volume: string;
    estimatedOneRepMax: string;
    bestWeight: string;
    bestReps: string;
    bestEstimatedOneRepMax: string;
    totalVolume: string;
    setsCount: string;
    entries: string;
  };
};

export function ExerciseProgressPanel({
  exerciseName,
  progress,
  summary,
  labels,
}: ExerciseProgressPanelProps) {
  const latestSummary = summary.data.at(-1) ?? null;

  if (progress.data.length === 0 && summary.data.length === 0) {
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
            {exerciseName}
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric
            label={labels.entries}
            value={formatInteger(progress.data.length)}
          />
          <Metric
            label={labels.bestWeight}
            value={latestSummary ? String(latestSummary.bestWeight) : "0"}
          />
          <Metric
            label={labels.bestEstimatedOneRepMax}
            value={latestSummary ? latestSummary.bestEstimatedOneRepMax.toFixed(1) : "0"}
          />
          <Metric
            label={labels.totalVolume}
            value={latestSummary ? formatInteger(latestSummary.totalVolume) : "0"}
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white">{labels.summaryTitle}</h3>
          <p className="mt-1 text-sm text-white/46">{labels.summaryDescription}</p>
          <div className="mt-4">
            <ExerciseProgressSummaryChart
              data={summary.data}
              labels={{
                empty: labels.chartEmpty,
                volume: labels.totalVolume,
                estimatedOneRepMax: labels.estimatedOneRepMax,
              }}
            />
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
        <h3 className="text-xl font-semibold text-white">{labels.historyTitle}</h3>
        <p className="mt-1 text-sm text-white/46">{labels.historyDescription}</p>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.14em] text-white/36">
                <th className="px-4">{labels.date}</th>
                <th className="px-4">{labels.setNumber}</th>
                <th className="px-4">{labels.weight}</th>
                <th className="px-4">{labels.reps}</th>
                <th className="px-4">{labels.rir}</th>
                <th className="px-4">{labels.volume}</th>
                <th className="px-4">{labels.estimatedOneRepMax}</th>
              </tr>
            </thead>
            <tbody>
              {progress.data.map((point, index) => (
                <tr key={`${point.date}-${point.setNumber}-${index}`} className="rounded-2xl bg-black/20 text-sm text-white/74">
                  <td className="rounded-l-2xl border-y border-l border-white/8 px-4 py-3">
                    {formatDateLabel(point.date)}
                  </td>
                  <td className="border-y border-white/8 px-4 py-3">#{point.setNumber}</td>
                  <td className="border-y border-white/8 px-4 py-3">{point.weight}</td>
                  <td className="border-y border-white/8 px-4 py-3">{point.reps}</td>
                  <td className="border-y border-white/8 px-4 py-3">{point.rir}</td>
                  <td className="border-y border-white/8 px-4 py-3">{formatInteger(point.volume)}</td>
                  <td className="rounded-r-2xl border-y border-r border-white/8 px-4 py-3">
                    {point.estimatedOneRepMax.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-white/36">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
