import type { UserProfile } from "@/src/features/dashboard/lib/dashboard.types";

export type Coach = UserProfile & {
  name: string;
  role: "coach" | string;
};

export type CoachesQuery = {
  search?: string;
};

export type CoachesResult = {
  coaches: Coach[];
  hasError: boolean;
  errorMessage: string | null;
};
