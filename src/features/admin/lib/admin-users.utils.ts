import type { UserProfile } from "@/src/features/dashboard/lib/dashboard.types";

export type ResolvedUserApprovalStatus = "pending" | "approved" | "rejected";

export function resolveUserApprovalStatus(
  user: UserProfile,
  pendingUserIds: Set<number>,
): ResolvedUserApprovalStatus {
  if (user.approvalStatus === "pending" || pendingUserIds.has(user.id)) {
    return "pending";
  }

  if (user.approvalStatus === "rejected" || user.rejectionReason) {
    return "rejected";
  }

  return "approved";
}

export function normalizeUserProfile(
  user: UserProfile,
  pendingUserIds: Set<number>,
): UserProfile & {
  approvalStatus: ResolvedUserApprovalStatus;
  rejectionReason: string | null;
} {
  return {
    ...user,
    approvalStatus: resolveUserApprovalStatus(user, pendingUserIds),
    rejectionReason: user.rejectionReason ?? null,
  };
}
