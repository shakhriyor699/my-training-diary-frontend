"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { DashboardNavSection } from "@/src/features/dashboard/components/dashboard-nav-section";
import { DashboardUserMenu } from "@/src/features/dashboard/components/dashboard-user-menu";

type NavItem = {
  key: string;
  href: string;
  icon: string;
  activePath?: string;
};

type DashboardShellProps = {
  locale: string;
  displayName: string;
  initials: string;
  settingsHref: string;
  settingsLabel: string;
  signOutLabel: string;
  mainTitle: string;
  communityTitle: string;
  adminTitle: string;
  primaryItems: readonly NavItem[];
  communityItems: readonly NavItem[];
  adminItems: readonly NavItem[];
  mainLabels: Record<string, string>;
  communityLabels: Record<string, string>;
  adminLabels: Record<string, string>;
  communityBadgeCounts: Partial<Record<string, number>>;
  children: React.ReactNode;
};

export function DashboardShell({
  locale,
  displayName,
  initials,
  settingsHref,
  settingsLabel,
  signOutLabel,
  mainTitle,
  communityTitle,
  adminTitle,
  primaryItems,
  communityItems,
  adminItems,
  mainLabels,
  communityLabels,
  adminLabels,
  communityBadgeCounts,
  children,
}: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen]);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="lg:hidden">
        <div className="sticky top-0 z-30 border-b border-white/8 bg-[linear-gradient(180deg,rgba(8,8,8,0.96),rgba(5,5,5,0.92))] px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-white transition-colors hover:bg-white/[0.08]"
              aria-label="Open navigation menu"
              aria-expanded={isSidebarOpen}
              aria-controls="mobile-dashboard-sidebar"
            >
              <MenuIcon className="h-5 w-5" />
            </button>

            <Link href={`/${locale}/dashboard`} className="flex min-w-0 items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#d8f76d,#a3e635_45%,#e76f51)] text-sm font-semibold text-black">
                TD
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-lg font-semibold tracking-tight">
                  Training
                </span>
                <span className="block truncate text-sm text-white/52">Diary</span>
              </span>
            </Link>

            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-sm font-semibold text-white/88">
              {initials}
            </span>
          </div>
        </div>

        <div
          className={[
            "fixed inset-0 z-40 transition-opacity duration-300",
            isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
          aria-hidden={!isSidebarOpen}
        >
          <button
            type="button"
            onClick={closeSidebar}
            className="absolute inset-0 bg-black/72 backdrop-blur-[2px]"
            aria-label="Close navigation menu"
          />

          <aside
            id="mobile-dashboard-sidebar"
            className={[
              "absolute left-0 top-0 flex h-full w-[min(86vw,320px)] flex-col border-r border-white/8 bg-[linear-gradient(180deg,#080808_0%,#050505_100%)] shadow-[0_24px_90px_rgba(0,0,0,0.55)] transition-transform duration-300 ease-out",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
          >
            <div className="flex items-center justify-between border-b border-white/6 px-4 py-5">
              <Link
                href={`/${locale}/dashboard`}
                className="flex items-center gap-3"
                onClick={closeSidebar}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#d8f76d,#a3e635_45%,#e76f51)] text-sm font-semibold text-black">
                  TD
                </span>
                <span className="leading-tight">
                  <span className="block text-[23px] font-semibold tracking-tight">
                    Training
                  </span>
                  <span className="block text-lg text-white/52">Diary</span>
                </span>
              </Link>

              <button
                type="button"
                onClick={closeSidebar}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-white transition-colors hover:bg-white/[0.08]"
                aria-label="Close navigation menu"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <SidebarContent
              locale={locale}
              displayName={displayName}
              initials={initials}
              settingsHref={settingsHref}
              settingsLabel={settingsLabel}
              signOutLabel={signOutLabel}
              mainTitle={mainTitle}
              communityTitle={communityTitle}
              adminTitle={adminTitle}
              primaryItems={primaryItems}
              communityItems={communityItems}
              adminItems={adminItems}
              mainLabels={mainLabels}
              communityLabels={communityLabels}
              adminLabels={adminLabels}
              communityBadgeCounts={communityBadgeCounts}
              onNavigate={closeSidebar}
            />
          </aside>
        </div>
      </div>

      <div className="grid min-h-screen lg:grid-cols-[252px_minmax(0,1fr)]">
        <aside className="hidden border-r border-white/6 bg-[linear-gradient(180deg,#080808_0%,#050505_100%)] lg:block">
          <SidebarContent
            locale={locale}
            displayName={displayName}
            initials={initials}
            settingsHref={settingsHref}
            settingsLabel={settingsLabel}
            signOutLabel={signOutLabel}
            mainTitle={mainTitle}
            communityTitle={communityTitle}
            adminTitle={adminTitle}
            primaryItems={primaryItems}
            communityItems={communityItems}
            adminItems={adminItems}
            mainLabels={mainLabels}
            communityLabels={communityLabels}
            adminLabels={adminLabels}
            communityBadgeCounts={communityBadgeCounts}
          />
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

type SidebarContentProps = Omit<DashboardShellProps, "children"> & {
  onNavigate?: () => void;
};

function SidebarContent({
  locale,
  displayName,
  initials,
  settingsHref,
  settingsLabel,
  signOutLabel,
  mainTitle,
  communityTitle,
  adminTitle,
  primaryItems,
  communityItems,
  adminItems,
  mainLabels,
  communityLabels,
  adminLabels,
  communityBadgeCounts,
  onNavigate,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="hidden border-b border-white/6 px-4 py-5 lg:block">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#d8f76d,#a3e635_45%,#e76f51)] text-sm font-semibold text-black">
            TD
          </span>
          <span className="leading-tight">
            <span className="block text-[23px] font-semibold tracking-tight">Training</span>
            <span className="block text-lg text-white/52">Diary</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-3 py-5">
        <DashboardNavSection
          title={mainTitle}
          locale={locale}
          items={primaryItems}
          labels={mainLabels}
          onNavigate={onNavigate}
        />
        <DashboardNavSection
          title={communityTitle}
          locale={locale}
          items={communityItems}
          labels={communityLabels}
          badgeCounts={communityBadgeCounts}
          onNavigate={onNavigate}
        />
        {adminItems.length > 0 ? (
          <DashboardNavSection
            title={adminTitle}
            locale={locale}
            items={adminItems}
            labels={adminLabels}
            onNavigate={onNavigate}
          />
        ) : null}
      </div>

      <div className="border-t border-white/6 px-3 py-4">
        <DashboardUserMenu
          locale={locale}
          label={displayName}
          initials={initials}
          settingsHref={settingsHref}
          settingsLabel={settingsLabel}
          signOutLabel={signOutLabel}
          onAction={onNavigate}
        />
      </div>
    </div>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" d="M4.5 7.5h15" />
      <path strokeLinecap="round" d="M4.5 12h15" />
      <path strokeLinecap="round" d="M4.5 16.5h15" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" d="m6.75 6.75 10.5 10.5" />
      <path strokeLinecap="round" d="m17.25 6.75-10.5 10.5" />
    </svg>
  );
}
