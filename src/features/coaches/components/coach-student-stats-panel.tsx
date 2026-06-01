import {
  formatCompactNumber,
  formatDateLabel,
  formatInteger,
  formatMuscleGroup,
} from "@/src/features/dashboard/lib/dashboard.utils";
import type { UserStats } from "@/src/features/dashboard/lib/dashboard.types";

type CoachStudentStatsPanelProps = {
  studentName: string;
  studentEmail: string;
  stats: UserStats;
  labels: {
    title: string;
    description: string;
    empty: string;
    workoutsWeek: string;
    workoutsWeekHint: string;
    totalVolume: string;
    totalVolumeHint: string;
    currentStreak: string;
    days: string;
    totalReps: string;
    averageRirHint: string;
    summaryTitle: string;
    summaryDescription: string;
    student: string;
    bestLift: string;
    bestLiftDescription: string;
    muscleFocus: string;
    muscleFocusDescription: string;
    monthSummary: string;
    monthSummaryDescription: string;
    lastWorkout: string;
    noData: string;
    noDataSecondary: string;
    workouts: string;
    sets: string;
    volume: string;
    reps: string;
  };
};

export function CoachStudentStatsPanel({
  studentName,
  studentEmail,
  stats,
  labels,
}: CoachStudentStatsPanelProps) {
  const topMuscleGroup = stats.muscleGroupStats[0];
  const bestLift = stats.bestEstimatedOneRepMaxByExercise[0];
  const lastWorkout = stats.summary.lastWorkout;
  const averageRirLabel =
    stats.summary.averageRir === null
      ? labels.noDataSecondary
      : `${labels.averageRirHint}: ${stats.summary.averageRir.toFixed(1)}`;

  const hasAnyData =
    stats.summary.totalWorkouts > 0 ||
    stats.summary.totalSets > 0 ||
    stats.summary.totalReps > 0 ||
    stats.summary.totalVolume > 0;

  if (!hasAnyData) {
    return (
      <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
        <div className="mb-6">
          <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
          <p className="mt-1 text-lg text-white/42">{labels.description}</p>
        </div>

        <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
          {labels.empty}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <section className="grid gap-4 xl:grid-cols-4">
        <StatCard
          label={labels.workoutsWeek}
          value={formatInteger(stats.week.totalWorkouts)}
          accent={`${labels.workoutsWeekHint}: ${formatInteger(stats.month.totalWorkouts - stats.week.totalWorkouts)}`}
          accentClassName="text-[#39d353]"
        />
        <StatCard
          label={labels.totalVolume}
          value={formatCompactNumber(stats.summary.totalVolume)}
          accent={`${labels.totalVolumeHint}: ${formatCompactNumber(stats.week.totalVolume)}`}
          accentClassName="text-[#ff6b5d]"
        />
        <StatCard
          label={labels.currentStreak}
          value={formatInteger(stats.summary.currentStreak)}
          suffix={labels.days}
          valueClassName="text-[#84cc16]"
        />
        <StatCard
          label={labels.totalReps}
          value={formatCompactNumber(stats.summary.totalReps)}
          accent={averageRirLabel}
          accentClassName="text-[#ff6b5d]"
        />
      </section>

      <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
        <div className="mb-6">
          <h2 className="text-[32px] font-semibold text-white">{labels.summaryTitle}</h2>
          <p className="mt-1 text-lg text-white/42">{labels.summaryDescription}</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <InfoPanel
              title={labels.student}
              description={studentEmail}
              value={studentName}
              secondary={studentEmail}
            />
            <InfoPanel
              title={labels.bestLift}
              description={labels.bestLiftDescription}
              value={
                bestLift
                  ? `${bestLift.exerciseName} • ${bestLift.estimatedOneRepMax.toFixed(1)} kg`
                  : labels.noData
              }
              secondary={
                bestLift
                  ? `${bestLift.weight} kg × ${bestLift.reps}`
                  : labels.noDataSecondary
              }
            />
            <InfoPanel
              title={labels.lastWorkout}
              description={lastWorkout?.plan.title ?? labels.noDataSecondary}
              value={lastWorkout ? formatDateLabel(lastWorkout.date) : labels.noData}
              secondary={
                lastWorkout
                  ? `${labels.workouts}: ${formatInteger(stats.summary.totalWorkouts)}`
                  : labels.noDataSecondary
              }
            />
          </div>

          <div className="space-y-4">
            <InfoPanel
              title={labels.muscleFocus}
              description={labels.muscleFocusDescription}
              value={
                topMuscleGroup
                  ? formatMuscleGroup(topMuscleGroup.muscleGroup)
                  : labels.noData
              }
              secondary={
                topMuscleGroup
                  ? `${formatInteger(topMuscleGroup.totalSets)} ${labels.sets} • ${formatCompactNumber(topMuscleGroup.totalVolume)} ${labels.volume}`
                  : labels.noDataSecondary
              }
            />
            <InfoPanel
              title={labels.monthSummary}
              description={labels.monthSummaryDescription}
              value={`${formatInteger(stats.month.totalWorkouts)} ${labels.workouts}`}
              secondary={`${formatInteger(stats.month.totalSets)} ${labels.sets} • ${formatCompactNumber(stats.month.totalReps)} ${labels.reps}`}
            />
          </div>
        </div>
      </section>
    </section>
  );
}

function StatCard({
  label,
  value,
  suffix,
  accent,
  accentClassName,
  valueClassName,
}: {
  label: string;
  value: string;
  suffix?: string;
  accent?: string;
  accentClassName?: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.2)]">
      <p className="text-[15px] text-white/42">{label}</p>
      <div className="mt-10 flex items-end gap-2">
        <span className={["text-[54px] font-semibold tracking-tight text-white", valueClassName].filter(Boolean).join(" ")}>
          {value}
        </span>
        {suffix ? <span className="pb-2 text-lg text-white/35">{suffix}</span> : null}
      </div>
      {accent ? <p className={["mt-1 text-sm", accentClassName ?? "text-white/42"].join(" ")}>{accent}</p> : null}
    </div>
  );
}

function InfoPanel({
  title,
  description,
  value,
  secondary,
}: {
  title: string;
  description: string;
  value: string;
  secondary: string;
}) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/[0.02] p-4">
      <p className="text-sm text-white/42">{title}</p>
      <p className="mt-1 text-sm text-white/34">{description}</p>
      <p className="mt-3 text-lg font-medium text-white">{value}</p>
      <p className="mt-1 text-sm text-white/52">{secondary}</p>
    </div>
  );
}
