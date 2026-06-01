import type { WorkoutDayHistoryResponse } from "./training-plans.types";

export type WorkoutDayHistoryTableRow = {
  date: string;
  note: string | null;
  setLabels: string[];
};

export type WorkoutDayHistoryTable = {
  exerciseId: number;
  exerciseName: string;
  description: string | null;
  type: string;
  muscleGroup: string;
  targetLabel: string;
  maxSets: number;
  rows: WorkoutDayHistoryTableRow[];
};

export function buildWorkoutDayHistoryTables(history: WorkoutDayHistoryResponse) {
  return history.exercises.map((exercise) => {
    const maxSets = exercise.history.reduce((currentMax, entry) => {
      return Math.max(currentMax, entry.sets.length, entry.target.sets);
    }, exercise.target.sets);

    const rows = exercise.history.map((entry) => {
      const labelsBySet = new Map(
        entry.sets.map((loggedSet) => [loggedSet.setNumber, loggedSet.label] as const),
      );

      return {
        date: entry.date,
        note: entry.note,
        setLabels: Array.from({ length: maxSets }, (_, index) => {
          return labelsBySet.get(index + 1) ?? "-";
        }),
      };
    });

    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      description: exercise.description,
      type: exercise.type,
      muscleGroup: exercise.muscleGroup,
      targetLabel: exercise.target.label,
      maxSets,
      rows,
    };
  });
}
