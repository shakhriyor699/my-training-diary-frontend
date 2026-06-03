import Link from "next/link";

import { toAdminUserTrainingOverviewSearchParams } from "../lib/admin-user-training-overview.query";
import type { AdminUserTrainingOverviewQuery } from "../lib/admin-user-training-overview.types";

export function PaginationLink({
  locale,
  userId,
  query,
  disabled,
  label,
}: {
  locale: string;
  userId: number;
  query: AdminUserTrainingOverviewQuery;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm text-white/28">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={`/${locale}/dashboard/users/${userId}?${toAdminUserTrainingOverviewSearchParams(query)}`}
      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
    >
      {label}
    </Link>
  );
}

export function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6">
        <h2 className="text-[32px] font-semibold text-white">{title}</h2>
        {description ? <p className="mt-1 text-lg text-white/42">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function SubPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/[0.02] p-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.2)]">
      <p className="text-[15px] text-white/42">{label}</p>
      <p className="mt-8 text-[44px] font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}

export function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/[0.02] p-4">
      <p className="text-sm text-white/42">{label}</p>
      <p className="mt-3 text-lg font-medium text-white">{value}</p>
    </div>
  );
}

export function EmptyState({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div
      className={[
        "rounded-[18px] border border-dashed border-white/10 bg-black/20 text-center text-white/52",
        compact ? "px-4 py-6 text-sm" : "px-6 py-12",
      ].join(" ")}
    >
      {label}
    </div>
  );
}
