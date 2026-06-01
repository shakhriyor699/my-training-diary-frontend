export type TrainingPlanStatus = "pending" | "approved" | "rejected";

export type TrainingPlanSortField = "createdAt" | "title";

export type SortOrder = "asc" | "desc";

export type PublicTrainingPlansQuery = {
  search?: string;
  authorId?: number;
  sort: TrainingPlanSortField;
  order: SortOrder;
  page: number;
  limit: number;
};

export type TrainingPlanExercise = {
  id: number;
  name: string;
  description?: string;
  order?: number;
  type: string;
  muscleGroup: string;
  targetSets: number;
  minReps: number;
  maxReps: number;
  targetRir: number;
  weightStep: number;
};

export type TrainingPlanWorkoutDay = {
  id: number;
  title: string;
  order: number;
  exercises?: TrainingPlanExercise[];
};

export type TrainingPlanAuthor = {
  id: number;
  email: string;
};

export type PublicTrainingPlan = {
  id: number;
  title: string;
  description: string;
  status: TrainingPlanStatus;
  author: TrainingPlanAuthor;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  workoutDays?: TrainingPlanWorkoutDay[];
};

export type PublicTrainingPlansResponse = {
  data: PublicTrainingPlan[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type PublicTrainingPlansResult = {
  response: PublicTrainingPlansResponse;
  hasError: boolean;
  errorMessage: string | null;
};

export type MyTrainingPlan = {
  id: number;
  title: string;
  description?: string;
  status: TrainingPlanStatus;
  rejectionReason: string | null;
  authorId?: number;
  assignedToUserId?: number;
  workoutDays?: TrainingPlanWorkoutDay[];
};

export type MyTrainingPlansResult = {
  plans: MyTrainingPlan[];
  hasError: boolean;
  errorMessage: string | null;
};

export type PendingTrainingPlan = {
  id: number;
  title: string;
  status: "pending";
  author: {
    id: number;
    email: string;
  };
};

export type PendingTrainingPlansResult = {
  plans: PendingTrainingPlan[];
  hasError: boolean;
  errorMessage: string | null;
};

export type TrainingSessionSetLog = {
  setNumber: number;
  weight: number;
  reps: number;
  rir: number;
  label?: string;
};

export type TrainingSessionExerciseLog = {
  id: number;
  exercise: {
    id: number;
    name: string;
    muscleGroup?: string;
  };
  note: string | null;
  target: {
    sets: number;
    minReps: number;
    maxReps: number;
    targetRir: number;
    weightStep: number;
    label?: string;
  };
  sets: TrainingSessionSetLog[];
};

export type MyTrainingSession = {
  id: number;
  date: string;
  workoutDay: {
    id: number;
    title: string;
    planId?: number;
    planTitle?: string;
  };
  exerciseLogs: TrainingSessionExerciseLog[];
};

export type MyTrainingSessionsResponse = {
  data: MyTrainingSession[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type MyTrainingSessionsQuery = {
  page: number;
  limit: number;
  date?: string;
};

export type MyTrainingSessionsResult = {
  response: MyTrainingSessionsResponse;
  hasError: boolean;
  errorMessage: string | null;
};

export type TrainingSessionDetailsResult = {
  session: MyTrainingSession | null;
  hasError: boolean;
  errorMessage: string | null;
};

export type ExerciseProgressPoint = {
  date: string;
  setNumber: number;
  weight: number;
  reps: number;
  rir: number;
  volume: number;
  estimatedOneRepMax: number;
};

export type ExerciseProgressResponse = {
  exerciseId: number;
  data: ExerciseProgressPoint[];
};

export type ExerciseProgressSummaryPoint = {
  date: string;
  bestWeight: number;
  bestReps: number;
  bestEstimatedOneRepMax: number;
  totalVolume: number;
  setsCount: number;
};

export type ExerciseProgressSummaryResponse = {
  exerciseId: number;
  data: ExerciseProgressSummaryPoint[];
};

export type ExerciseProgressResult = {
  response: ExerciseProgressResponse;
  hasError: boolean;
  errorMessage: string | null;
};

export type ExerciseProgressSummaryResult = {
  response: ExerciseProgressSummaryResponse;
  hasError: boolean;
  errorMessage: string | null;
};

export type WorkoutDayHistorySet = {
  setNumber: number;
  weight: number;
  reps: number;
  rir: number;
  label: string;
};

export type WorkoutDayHistoryEntry = {
  date: string;
  note: string | null;
  target: {
    sets: number;
    minReps: number;
    maxReps: number;
    targetRir: number;
    weightStep: number;
  };
  sets: WorkoutDayHistorySet[];
};

export type WorkoutDayHistoryExercise = {
  id: number;
  name: string;
  description: string | null;
  type: string;
  muscleGroup: string;
  target: {
    sets: number;
    minReps: number;
    maxReps: number;
    targetRir: number;
    weightStep: number;
    label: string;
  };
  history: WorkoutDayHistoryEntry[];
};

export type WorkoutDayHistoryResponse = {
  workoutDay: {
    id: number;
    title: string;
    planId: number;
    planTitle: string;
  };
  exercises: WorkoutDayHistoryExercise[];
};

export type WorkoutDayHistoryResult = {
  response: WorkoutDayHistoryResponse | null;
  hasError: boolean;
  errorMessage: string | null;
};

export type ExerciseRecommendationAction =
  | "start"
  | "increase_reps"
  | "increase_weight"
  | "keep_weight"
  | "deload";

export type ExerciseRecommendation = {
  action: ExerciseRecommendationAction;
  currentWeight?: number;
  recommendedWeight?: number;
  increaseBy?: number;
  reason: string;
  message: string;
};

export type ExerciseRecommendationResponse = ExerciseRecommendation & {
  exerciseId?: number;
};

export type ExerciseRecommendationResult = {
  response: ExerciseRecommendationResponse | null;
  hasError: boolean;
  errorMessage: string | null;
};

export type NextWorkoutDayRecommendationItem = {
  exerciseId: number;
  name: string;
  type: string;
  targetSets: number;
  minReps: number;
  maxReps: number;
  targetRir: number;
  weightStep: number;
  recommendation: ExerciseRecommendation;
};

export type NextWorkoutDayResponse = {
  workoutDay: {
    id: number;
    title: string;
    planId: number;
    planTitle: string;
    goal: string;
  };
  recommendations: NextWorkoutDayRecommendationItem[];
};

export type NextWorkoutDayResult = {
  response: NextWorkoutDayResponse | null;
  hasError: boolean;
  errorMessage: string | null;
};
