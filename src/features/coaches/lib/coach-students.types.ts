import type { UserProfile } from "@/src/features/dashboard/lib/dashboard.types";

export type CoachStudent = {
  id: number;
  studentId: number;
  coachId: number;
  status: "accepted" | string;
  student: UserProfile;
};

export type CoachStudentsResult = {
  students: CoachStudent[];
  hasError: boolean;
  errorMessage: string | null;
};
