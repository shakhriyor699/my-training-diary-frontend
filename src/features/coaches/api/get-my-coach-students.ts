import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type { CoachStudent, CoachStudentsResult } from "../lib/coach-students.types";

export function getMyCoachStudents() {
  return serverApiFetch<CoachStudent[]>("/coaches/students/my", {
    authenticated: true,
  });
}

export async function getMyCoachStudentsSafe(): Promise<CoachStudentsResult> {
  try {
    const students = await getMyCoachStudents();

    return {
      students,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      students: [],
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load coach students.",
    };
  }
}
