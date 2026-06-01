import { z } from "zod";

export const updateTrainingPlanStatusSchema = z
  .object({
    status: z.enum(["approved", "rejected"]),
    reason: z.string().trim().optional(),
  })
  .superRefine((value, context) => {
    if (value.status === "rejected" && !value.reason?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["reason"],
        message: "Reason is required when rejecting a plan.",
      });
    }
  });

export type UpdateTrainingPlanStatusInput = z.infer<
  typeof updateTrainingPlanStatusSchema
>;
