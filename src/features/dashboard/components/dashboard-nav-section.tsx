"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  key: string;
  href: string;
  icon: string;
  activePath?: string;
};

type DashboardNavSectionProps = {
  title: string;
  locale: string;
  items: readonly NavItem[];
  labels: Record<string, string>;
  badgeCounts?: Partial<Record<string, number>>;
  onNavigate?: () => void;
};

export function DashboardNavSection({
  title,
  locale,
  items,
  labels,
  badgeCounts,
  onNavigate,
}: DashboardNavSectionProps) {
  const pathname = usePathname();
  const normalizedPathname = pathname.startsWith(`/${locale}`)
    ? pathname.slice(locale.length + 1) || "/"
    : pathname;

  return (
    <section className="space-y-3">
      <p className="px-2 text-sm text-white/42">{title}</p>
      <div className="space-y-1.5">
        {items.map((item) => {
          const Icon = ICONS[item.icon] ?? HomeIcon;
          const activePath = item.activePath ?? `/${item.href}`;
          const badgeCount = badgeCounts?.[item.key] ?? 0;
          const isActive =
            normalizedPathname === activePath ||
            (activePath !== "/dashboard" &&
              normalizedPathname.startsWith(`${activePath}/`));

          return (
            <Link
              key={item.key}
              href={`/${locale}/${item.href}`}
              onClick={onNavigate}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors",
                isActive
                  ? "bg-[#fa614d] font-medium text-white"
                  : "text-white/78 hover:bg-white/[0.04]",
              ].join(" ")}
            >
              <span className="relative inline-flex">
                <Icon className="h-4.5 w-4.5" />
                {badgeCount > 0 ? (
                  <span className="absolute -right-2.5 -top-2.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#fa614d] px-1 text-[10px] font-semibold leading-none text-white shadow-[0_6px_20px_rgba(250,97,77,0.35)]">
                    {formatBadgeCount(badgeCount)}
                  </span>
                ) : null}
              </span>
              <span>{labels[item.key] ?? item.key}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function formatBadgeCount(value: number) {
  return value > 99 ? "99+" : String(value);
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  home: HomeIcon,
  calendar: CalendarIcon,
  bookmark: BookmarkIcon,
  list: ListIcon,
  bolt: BoltIcon,
  trend: TrendIcon,
  chart: ChartIcon,
  users: UsersIcon,
  userCheck: UserCheckIcon,
  bell: BellIcon,
  shield: ShieldIcon,
  cog: CogIcon,
};

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 10.5 12 4.5l8.25 6v8.25a1.5 1.5 0 0 1-1.5 1.5h-13.5a1.5 1.5 0 0 1-1.5-1.5V10.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20.25V12.75h6v7.5" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75V6m9-2.25V6M4.5 9h15M5.25 5.25h13.5a.75.75 0 0 1 .75.75v12.75a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V6a.75.75 0 0 1 .75-.75Z" />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 4.5h9a1.5 1.5 0 0 1 1.5 1.5v13.5l-6-3.75-6 3.75V6a1.5 1.5 0 0 1 1.5-1.5Z" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h11.25M8.25 12h11.25M8.25 17.25h11.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75h.008v.008H4.5V6.75ZM4.5 12h.008v.008H4.5V12Zm0 5.25h.008v.008H4.5V17.25Z" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m13.5 3.75-7.5 9h5.25l-.75 7.5 7.5-9H12.75l.75-7.5Z" />
    </svg>
  );
}

function TrendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 15.75 5.25-5.25 3.75 3.75 7.5-7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75H20.25V11.25" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 4.5V19.5M10.5 10.5V19.5M15.75 7.5V19.5M21 13.5V19.5" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 18.75v-.75A3.75 3.75 0 0 0 12 14.25H6.75A3.75 3.75 0 0 0 3 18v.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.375 10.5a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25ZM20.25 18.75v-.75A3.75 3.75 0 0 0 17.25 14.34M15 5.37a2.625 2.625 0 0 1 0 5.13" />
    </svg>
  );
}

function UserCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5v-.75A3.75 3.75 0 0 0 11.25 15H6.75A3.75 3.75 0 0 0 3 18.75v.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 11.25A3 3 0 1 0 9 5.25a3 3 0 0 0 0 6ZM15.75 9.75l1.5 1.5 3-3" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 18.75a2.25 2.25 0 0 1-4.5 0M18.75 15.75H5.25l1.5-1.5v-3.75a5.25 5.25 0 1 1 10.5 0v3.75l1.5 1.5Z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75 5.25 6v5.25c0 4.386 2.72 8.314 6.75 9.75 4.03-1.436 6.75-5.364 6.75-9.75V6L12 3.75Z" />
    </svg>
  );
}

function CogIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317a1.724 1.724 0 0 1 3.35 0 1.724 1.724 0 0 0 2.573 1.066 1.724 1.724 0 0 1 2.908 1.678 1.724 1.724 0 0 0 .78 2.343 1.724 1.724 0 0 1 0 3.192 1.724 1.724 0 0 0-.78 2.343 1.724 1.724 0 0 1-2.908 1.678 1.724 1.724 0 0 0-2.573 1.066 1.724 1.724 0 0 1-3.35 0 1.724 1.724 0 0 0-2.573-1.066 1.724 1.724 0 0 1-2.908-1.678 1.724 1.724 0 0 0-.78-2.343 1.724 1.724 0 0 1 0-3.192 1.724 1.724 0 0 0 .78-2.343 1.724 1.724 0 0 1 2.908-1.678 1.724 1.724 0 0 0 2.573-1.066Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
    </svg>
  );
}
