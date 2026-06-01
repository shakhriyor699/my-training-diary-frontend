export type CoachStudentSessionSetLog = {
  id: number;
  exerciseId: number;
  exercise: {
    id: number;
    name: string;
    muscleGroup: string;
  };
  setNumber: number;
  weight: number;
  reps: number;
  rir: number;
};

export type CoachStudentSession = {
  id: number;
  date: string;
  plan: {
    id: number;
    title: string;
  };
  setLogs: CoachStudentSessionSetLog[];
};

export type CoachStudentSessionsQuery = {
  page: number;
  limit: number;
};

export type CoachStudentSessionsResponse = {
  data: CoachStudentSession[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type CoachStudentSessionsResult = {
  response: CoachStudentSessionsResponse;
  hasError: boolean;
  errorMessage: string | null;
};
