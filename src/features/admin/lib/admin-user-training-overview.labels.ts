export type UserTrainingOverviewLabels = {
  profileTitle: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  emptyValue: string;
  counts: {
    totalPlans: string;
    assignedPlans: string;
    authoredPlans: string;
    activeExercises: string;
  };
  activePlan: {
    title: string;
    description: string;
    empty: string;
  };
  recentSessions: {
    title: string;
    description: string;
    empty: string;
  };
  topExercises: {
    title: string;
    description: string;
    empty: string;
  };
  stats: {
    title: string;
    description: string;
    totalWorkouts: string;
    totalSets: string;
    totalReps: string;
    totalVolume: string;
    averageRir: string;
    currentStreak: string;
    days: string;
    lastWorkout: string;
    week: string;
    month: string;
    muscleGroups: string;
    bestLifts: string;
    noData: string;
  };
  plans: {
    title: string;
    description: string;
    assigned: string;
    authored: string;
    empty: string;
  };
  sessions: {
    title: string;
    description: string;
    empty: string;
    page: string;
    previous: string;
    next: string;
    filterDate: string;
    filterApply: string;
    filterReset: string;
  };
  exerciseProgress: {
    title: string;
    description: string;
    empty: string;
  };
  planDetails: {
    description: string;
    goal: string;
    author: string;
    assignedUser: string;
    deload: string;
    workoutDays: string;
    exercises: string;
    noWorkoutDays: string;
  };
  sessionDetails: {
    plan: string;
    workoutDay: string;
    exercises: string;
    noExercises: string;
    target: string;
    sets: string;
    set: string;
    weight: string;
    reps: string;
    rir: string;
  };
  progressDetails: {
    exercise: string;
    muscleGroup: string;
    workoutDay: string;
    plan: string;
    sessionsCount: string;
    lastPerformedAt: string;
    bestEstimatedOneRepMax: string;
    totalVolume: string;
    recentEntries: string;
    noEntries: string;
  };
};
