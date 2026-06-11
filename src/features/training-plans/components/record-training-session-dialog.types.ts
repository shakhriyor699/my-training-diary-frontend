import type {
  ExerciseRecommendationAction,
  MyTrainingPlan,
} from "@/src/features/training-plans/lib/training-plans.types";

export type SessionRow = {
  exerciseId: number;
  setNumber: number;
  exerciseName: string;
  targetLabel: string;
  weight: string;
  reps: string;
  rir: string;
  readonly: boolean;
};

export type GroupedSessionRow = {
  exerciseId: number;
  exerciseName: string;
  targetLabel: string;
  rows: Array<SessionRow & { index: number }>;
};

export type RecordTrainingSessionDialogLabels = {
  trigger: string;
  title: string;
  description: string;
  noExercises: string;
  day: string;
  dayLabel: string;
  dayPlaceholder: string;
  dateLabel: string;
  exercise: string;
  setNumber: string;
  target: string;
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
  savedReadonly: string;
  readonlyHint: string;
  recommendationTitle: string;
  message: string;
  reason: string;
  currentWeight: string;
  recommendedWeight: string;
  increaseBy: string;
  actions: Record<ExerciseRecommendationAction, string>;
};

export type RecordTrainingSessionDialogProps = {
  plan: MyTrainingPlan;
  triggerClassName?: string;
  initialWorkoutDayId?: number;
  initiallyOpen?: boolean;
  labels: RecordTrainingSessionDialogLabels;
};
