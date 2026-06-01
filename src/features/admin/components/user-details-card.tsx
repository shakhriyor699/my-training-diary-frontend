import { formatDateLabel, formatRole } from "@/src/features/dashboard/lib/dashboard.utils";
import type { UserProfile } from "@/src/features/dashboard/lib/dashboard.types";

type UserDetailsCardProps = {
  user: UserProfile | null;
  labels: {
    title: string;
    id: string;
    email: string;
    role: string;
    status: string;
    rejectionReason: string;
    noReason: string;
    createdAt: string;
    empty: string;
    emptyDescription: string;
  };
};

export function UserDetailsCard({
  user,
  labels,
}: UserDetailsCardProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6">
        <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
      </div>

      {user ? (
        <div className="grid gap-4 md:grid-cols-2">
          <DetailItem label={labels.id} value={String(user.id)} />
          <DetailItem label={labels.email} value={user.email} />
          <DetailItem label={labels.role} value={formatRole(user.role)} />
          <DetailItem label={labels.status} value={user.approvalStatus ?? "approved"} />
          <DetailItem label={labels.createdAt} value={formatDateLabel(user.createdAt)} />
          <DetailItem
            label={labels.rejectionReason}
            value={user.rejectionReason ?? labels.noReason}
          />
        </div>
      ) : (
        <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-5 py-6">
          <p className="text-lg font-medium text-white">{labels.empty}</p>
          <p className="mt-2 text-sm text-white/46">{labels.emptyDescription}</p>
        </div>
      )}
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/[0.02] p-4">
      <p className="text-sm text-white/42">{label}</p>
      <p className="mt-3 text-lg font-medium text-white">{value}</p>
    </div>
  );
}
