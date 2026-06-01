import type { UserProfile } from "@/src/features/dashboard/lib/dashboard.types";

export type CoachRequestStatus = "pending" | "accepted" | "rejected" | string;

export type CoachRequestStatusUpdateResponse = {
  id: number;
  studentId: number;
  coachId: number;
  status: "accepted" | "rejected";
};

export type CoachRequest = {
  id: number;
  studentId: number;
  coachId: number;
  status: CoachRequestStatus;
  message: string;
  student: UserProfile;
  createdAt: string;
};

export type CoachRequestsResult = {
  requests: CoachRequest[];
  hasError: boolean;
  errorMessage: string | null;
};
