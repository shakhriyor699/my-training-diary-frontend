import { formatDateLabel, formatInteger } from "@/src/features/dashboard/lib/dashboard.utils";

import { DeleteTrainingSessionButton } from "./delete-training-session-button";
import { EditTrainingSessionDialog } from "./edit-training-session-dialog";
import type { MyTrainingSession } from "../lib/training-plans.types";

type TrainingSessionDetailsCardProps = {
  locale: string;
  session: MyTrainingSession | null;
  labels: {
    title: string;
    empty: string;
    emptyDescription: string;
    date: string;
    workoutDay: string;
    totalSets: string;
    totalVolume: string;
    exerciseLogs: string;
    set: string;
    weight: string;
    reps: string;
    rir: string;
    note: string;
    target: string;
    noSets: string;
    edit: {
      trigger: string;
      title: string;
      description: string;
      noSets: string;
      exercise: string;
      note: string;
      notePlaceholder: string;
      setNumber: string;
      weight: string;
      reps: string;
      rir: string;
      weightPlaceholder: string;
      repsPlaceholder: string;
      rirPlaceholder: string;
      submit: string;
      submitting: string;
      cancel: string;
      success: string;
      errorFallback: string;
      emptySets: string;
      incompleteSet: string;
    };
    delete: {
      trigger: string;
      confirmTitle: string;
      confirmDescription: string;
      confirm: string;
      deleting: string;
      cancel: string;
      success: string;
      errorFallback: string;
    };
  };
};

export function TrainingSessionDetailsCard({
  locale,
  session,
  labels,
}: TrainingSessionDetailsCardProps) {
  if (!session) {
    return (
      <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
        <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center">
          <p className="text-xl font-semibold text-white">{labels.empty}</p>
          <p className="mt-2 text-sm text-white/48">{labels.emptyDescription}</p>
        </div>
      </section>
    );
  }

  const totalSets = session.exerciseLogs.reduce(
    (sum, exerciseLog) => sum + exerciseLog.sets.length,
    0,
  );
  const totalVolume = session.exerciseLogs.reduce(
    (sum, exerciseLog) =>
      sum +
      exerciseLog.sets.reduce((exerciseSum, setLog) => exerciseSum + setLog.weight * setLog.reps, 0),
    0,
  );

  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
              ID {session.id}
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-white">{session.workoutDay.title}</h2>
            <p className="mt-2 text-sm text-white/52">
              {labels.date}: {formatDateLabel(session.date)}
            </p>
          </div>
        </div>

        <div className="grid min-w-[260px] gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] p-4 text-sm text-white/64">
          <Metric label={labels.workoutDay} value={`#${session.workoutDay.id}`} />
          <Metric label={labels.totalSets} value={formatInteger(totalSets)} />
          <Metric label={labels.totalVolume} value={formatInteger(totalVolume)} />
          <div className="pt-2">
            <EditTrainingSessionDialog
              session={session}
              triggerClassName="w-full"
              labels={labels.edit}
            />
          </div>
          <DeleteTrainingSessionButton
            locale={locale}
            session={session}
            triggerClassName="w-full"
            labels={labels.delete}
          />
        </div>
      </div>

      <div className="mt-6 rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-white/36">
          {labels.exerciseLogs}
        </p>

        {session.exerciseLogs.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center text-white/52">
            {labels.noSets}
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {session.exerciseLogs.map((exerciseLog) => (
              <div
                key={exerciseLog.id}
                className="rounded-2xl border border-white/8 bg-black/20 p-4"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-medium text-white">{exerciseLog.exercise.name}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-sm text-white/48">
                      <span>
                        {labels.target}:{" "}
                        {exerciseLog.target.label ??
                          `${exerciseLog.target.sets} x ${exerciseLog.target.minReps}-${exerciseLog.target.maxReps} • RIR ${exerciseLog.target.targetRir}`}
                      </span>
                      {exerciseLog.note ? (
                        <span>
                          {labels.note}: {exerciseLog.note}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    {exerciseLog.sets.map((setLog) => (
                      <div
                        key={`${exerciseLog.id}-${setLog.setNumber}`}
                        className="flex flex-col gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3 text-sm text-white/62 sm:flex-row sm:items-center sm:justify-between"
                      >
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
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
