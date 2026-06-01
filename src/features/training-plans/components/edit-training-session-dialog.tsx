"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { updateTrainingSession } from "@/src/features/training-plans/api/update-training-session";
import {
  type TrainingSessionExerciseInput,
  type TrainingSessionSetInput,
  updateTrainingSessionSchema,
} from "@/src/features/training-plans/lib/create-training-session.schema";
import type { MyTrainingSession } from "@/src/features/training-plans/lib/training-plans.types";
import { cn } from "@/src/shared/lib/utils";

type SessionRow = {
  exerciseId: number;
  exerciseName: string;
  note: string;
  setNumber: number;
  weight: string;
  reps: string;
  rir: string;
};

type EditTrainingSessionDialogProps = {
  session: MyTrainingSession;
  triggerClassName?: string;
  labels: {
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
};

export function EditTrainingSessionDialog({
  session,
  triggerClassName,
  labels,
}: EditTrainingSessionDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [rows, setRows] = useState<SessionRow[]>(createSessionRows(session));

  const mutation = useMutation({
    mutationFn: (payload: {
      workoutDayId: number;
      exercises: TrainingSessionExerciseInput[];
    }) => updateTrainingSession(session.id, payload),
    onSuccess: () => {
      startTransition(() => {
        setIsOpen(false);
        setFormError(null);
        setRows(createSessionRows(session));
        toast.success(labels.success);
        router.refresh();
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : labels.errorFallback;
      setFormError(message);
      toast.error(message);
    },
  });

  const hasRows = rows.length > 0;

  function handleChange(
    index: number,
    field: "weight" | "reps" | "rir" | "note",
    value: string,
  ) {
    setRows((currentRows) =>
      currentRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  }

  async function handleSubmit() {
    setFormError(null);

    const exercisesMap = new Map<number, TrainingSessionExerciseInput>();

    try {
      rows.forEach((row) => {
        const hasAnyValue = row.weight !== "" || row.reps !== "" || row.rir !== "";

        if (!hasAnyValue) {
          return;
        }

        if (row.weight === "" || row.reps === "" || row.rir === "") {
          throw new Error(labels.incompleteSet);
        }

        const set: TrainingSessionSetInput = {
          setNumber: row.setNumber,
          weight: Number(row.weight),
          reps: Number(row.reps),
          rir: Number(row.rir),
        };

        const existing = exercisesMap.get(row.exerciseId);

        if (existing) {
          existing.sets.push(set);
          if (row.note.trim()) {
            existing.note = row.note.trim();
          }
        } else {
          exercisesMap.set(row.exerciseId, {
            exerciseId: row.exerciseId,
            note: row.note.trim() ? row.note.trim() : undefined,
            sets: [set],
          });
        }
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : labels.errorFallback);
      return;
    }

    const exercises = Array.from(exercisesMap.values()).map((exercise) => ({
      ...exercise,
      note: exercise.note?.trim() ? exercise.note.trim() : undefined,
      sets: exercise.sets.sort((left, right) => left.setNumber - right.setNumber),
    }));

    if (exercises.length === 0) {
      setFormError(labels.emptySets);
      return;
    }

    const parsed = updateTrainingSessionSchema.safeParse({
      workoutDayId: session.workoutDay.id,
      exercises,
    });

    if (!parsed.success) {
      const fieldError = parsed.error.flatten().formErrors[0];
      setFormError(fieldError ?? labels.errorFallback);
      return;
    }

    await mutation.mutateAsync(parsed.data);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setRows(createSessionRows(session));
          setFormError(null);
          setIsOpen(true);
        }}
        disabled={!hasRows}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08] disabled:opacity-60",
          triggerClassName,
        )}
      >
        {labels.trigger}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-4xl rounded-[24px] border border-white/8 bg-[#090909] p-6 shadow-[0_24px_120px_rgba(0,0,0,0.42)]">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold text-white">{labels.title}</h2>
              <p className="text-sm text-white/48">{labels.description}</p>
            </div>

            {!hasRows ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-6 text-sm text-white/58">
                {labels.noSets}
              </div>
            ) : (
              <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
                {rows.map((row, index) => (
                  <div
                    key={`${row.exerciseId}-${row.setNumber}`}
                    className="rounded-[18px] border border-white/8 bg-black/20 p-4"
                  >
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-white/38">
                          {labels.exercise}
                        </p>
                        <p className="mt-1 font-medium text-white">{row.exerciseName}</p>
                      </div>

                      <div className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
                        {labels.setNumber} #{row.setNumber}
                      </div>
                    </div>

                    <label className="mb-3 block">
                      <span className="text-xs uppercase tracking-[0.14em] text-white/38">
                        {labels.note}
                      </span>
                      <input
                        type="text"
                        value={row.note}
                        placeholder={labels.notePlaceholder}
                        onChange={(event) =>
                          handleChange(index, "note", event.target.value)
                        }
                        className="mt-2 h-11 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                      />
                    </label>

                    <div className="grid gap-3 md:grid-cols-3">
                      <InputField
                        label={labels.weight}
                        value={row.weight}
                        placeholder={labels.weightPlaceholder}
                        onChange={(value) => handleChange(index, "weight", value)}
                      />
                      <InputField
                        label={labels.reps}
                        value={row.reps}
                        placeholder={labels.repsPlaceholder}
                        onChange={(value) => handleChange(index, "reps", value)}
                      />
                      <InputField
                        label={labels.rir}
                        value={row.rir}
                        placeholder={labels.rirPlaceholder}
                        onChange={(value) => handleChange(index, "rir", value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formError ? (
              <div className="mt-4 rounded-2xl border border-[#ff7b72]/18 bg-[#ff7b72]/8 px-4 py-3 text-sm text-[#ff7b72]">
                {formError}
              </div>
            ) : null}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                {labels.cancel}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={mutation.isPending || isPending || !hasRows}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1cc31c] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#27d927] disabled:opacity-60"
              >
                {mutation.isPending || isPending ? labels.submitting : labels.submit}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function createSessionRows(session: MyTrainingSession): SessionRow[] {
  return session.exerciseLogs
    .flatMap((exerciseLog) =>
      exerciseLog.sets.map((setLog) => ({
        exerciseId: exerciseLog.exercise.id,
        exerciseName: exerciseLog.exercise.name,
        note: exerciseLog.note ?? "",
        setNumber: setLog.setNumber,
        weight: String(setLog.weight),
        reps: String(setLog.reps),
        rir: String(setLog.rir),
      })),
    )
    .sort((left, right) => {
      if (left.exerciseId !== right.exerciseId) {
        return left.exerciseId - right.exerciseId;
      }

      return left.setNumber - right.setNumber;
    });
}

function InputField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.14em] text-white/38">
        {label}
      </span>
      <input
        type="number"
        min="0"
        step="0.5"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
      />
    </label>
  );
}
