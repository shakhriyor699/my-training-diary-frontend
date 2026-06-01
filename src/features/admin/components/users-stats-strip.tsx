import type { UsersListResponse } from "../lib/admin-users.types";

type UsersStatsStripProps = {
  response: UsersListResponse;
  labels: {
    total: string;
    pending: string;
    approved: string;
    rejected: string;
  };
};

export function UsersStatsStrip({
  response,
  labels,
}: UsersStatsStripProps) {
  const pendingCount = response.data.filter((user) => user.approvalStatus === "pending").length;
  const approvedCount = response.data.filter((user) => user.approvalStatus === "approved").length;
  const rejectedCount = response.data.filter((user) => user.approvalStatus === "rejected").length;

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label={labels.total} value={String(response.meta.total)} />
      <StatCard label={labels.pending} value={String(pendingCount)} />
      <StatCard label={labels.approved} value={String(approvedCount)} />
      <StatCard label={labels.rejected} value={String(rejectedCount)} />
    </section>
  );
}

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-[#070707] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.2)]">
      <p className="text-sm text-white/42">{label}</p>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}
