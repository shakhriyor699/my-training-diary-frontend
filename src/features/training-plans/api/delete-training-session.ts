import { clientApiFetch } from "@/src/shared/api/client-fetch";

type DeleteTrainingSessionResponse = {
  success: true;
  message: string;
};

export function deleteTrainingSession(sessionId: number) {
  return clientApiFetch<DeleteTrainingSessionResponse>(
    `/api/training-plans/sessions/${sessionId}`,
    {
      method: "DELETE",
      message: "Unable to delete training session.",
    },
  );
}
