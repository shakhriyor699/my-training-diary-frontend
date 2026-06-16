import { formatDateLabel, formatRole } from "@/src/features/dashboard/lib/dashboard.utils";
import type { UserProfile } from "@/src/features/dashboard/lib/dashboard.types";
import { EditUserDialog } from "@/src/features/users/components/edit-user-dialog";

type ProfileCardProps = {
  user: UserProfile;
  labels: {
    title: string;
    description: string;
    name: string;
    nameEmpty: string;
    id: string;
    email: string;
    role: string;
    createdAt: string;
    approvalStatus: string;
    edit: {
      trigger: string;
      title: string;
      description: string;
      email: string;
      emailPlaceholder: string;
      password: string;
      passwordPlaceholder: string;
      role: string;
      submit: string;
      submitting: string;
      cancel: string;
      errorFallback: string;
      success: string;
    };
  };
};

export function ProfileCard({ user, labels }: ProfileCardProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
          <p className="mt-1 text-lg text-white/42">{labels.description}</p>
        </div>
        <EditUserDialog
          user={user}
          roleOptions={[]}
          canEditRole={false}
          labels={labels.edit}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailItem label={labels.name} value={user.name?.trim() || labels.nameEmpty} />
        <DetailItem label={labels.id} value={String(user.id)} />
        <DetailItem label={labels.email} value={user.email} />
        <DetailItem label={labels.role} value={formatRole(user.role)} />
        <DetailItem label={labels.createdAt} value={formatDateLabel(user.createdAt)} />
        <DetailItem
          label={labels.approvalStatus}
          value={user.approvalStatus ?? "approved"}
        />
      </div>
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
