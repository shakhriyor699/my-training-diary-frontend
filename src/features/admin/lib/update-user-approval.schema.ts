import { z } from "zod";

export const updateUserApprovalSchema = z
  .object({
    status: z.enum(["approved", "rejected"]),
    reason: z.string().trim().optional(),
  })
  .superRefine((value, context) => {
    if (value.status === "rejected" && !value.reason?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["reason"],
        message: "Reason is required when rejecting a user.",
      });
    }
  });

export type UpdateUserApprovalInput = z.infer<typeof updateUserApprovalSchema>;
