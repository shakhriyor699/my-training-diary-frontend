import { formatDateLabel, formatRole } from "@/src/features/dashboard/lib/dashboard.utils";
import type { UserProfile } from "@/src/features/dashboard/lib/dashboard.types";

import { UserApprovalActions } from "./user-approval-actions";

type PendingUsersPanelProps = {
  users: Array<
    UserProfile & {
      approvalStatus: "pending" | "approved" | "rejected";
      rejectionReason: string | null;
    }
  >;
  labels: {
    title: string;
    description: string;
    empty: string;
    submittedAt: string;
    status: string;
    pending: string;
    approve: string;
    approving: string;
    reject: string;
    rejectTitle: string;
    rejectDescription: string;
    rejectReason: string;
    rejectReasonPlaceholder: string;
    submitReject: string;
    rejecting: string;
    cancel: string;
    approveSuccess: string;
    rejectSuccess: string;
    errorFallback: string;
  };
};

export function PendingUsersPanel({
  users,
  labels,
}: PendingUsersPanelProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6 space-y-2">
        <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
        <p className="text-lg text-white/42">{labels.description}</p>
      </div>

      {users.length === 0 ? (
        <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-5 py-6 text-sm text-white/52">
          {labels.empty}
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {users.map((user) => (
            <article
              key={user.id}
              className="rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-semibold text-white">{user.email}</p>
                    <p className="mt-1 text-sm text-white/48">
                      {user.name?.trim() || formatRole(user.role)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex rounded-full border border-[#facc15]/18 bg-[#facc15]/10 px-3 py-1 text-xs font-semibold text-[#fde68a]">
                      {labels.pending}
                    </span>
                    <span className="inline-flex rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/68">
                      {formatRole(user.role)}
                    </span>
                  </div>
                </div>

                <UserApprovalActions
                  userId={user.id}
                  labels={{
                    approve: labels.approve,
                    approving: labels.approving,
                    reject: labels.reject,
                    rejectTitle: labels.rejectTitle,
                    rejectDescription: labels.rejectDescription,
                    rejectReason: labels.rejectReason,
                    rejectReasonPlaceholder: labels.rejectReasonPlaceholder,
                    submitReject: labels.submitReject,
                    rejecting: labels.rejecting,
                    cancel: labels.cancel,
                    approveSuccess: labels.approveSuccess,
                    rejectSuccess: labels.rejectSuccess,
                    errorFallback: labels.errorFallback,
                  }}
                />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <DetailItem label="ID" value={String(user.id)} />
                <DetailItem label={labels.submittedAt} value={formatDateLabel(user.createdAt)} />
                <DetailItem label={labels.status} value={labels.pending} />
                <DetailItem label="Role" value={formatRole(user.role)} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-black/20 p-4">
      <p className="text-sm text-white/42">{label}</p>
      <p className="mt-3 text-base font-medium text-white">{value}</p>
    </div>
  );
}
