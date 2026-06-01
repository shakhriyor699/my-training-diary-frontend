"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type DashboardUserMenuProps = {
  locale: string;
  label: string;
  settingsLabel: string;
  signOutLabel: string;
  settingsHref: string;
  initials: string;
  onAction?: () => void;
};

export function DashboardUserMenu({
  locale,
  label,
  settingsLabel,
  signOutLabel,
  settingsHref,
  initials,
  onAction,
}: DashboardUserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    onAction?.();
    startTransition(async () => {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.replace(`/${locale}/login`);
      router.refresh();
    });
  };

  return (
    <div className="relative mt-4">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center gap-3 rounded-2xl border border-white/7 bg-white/[0.02] px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
        aria-expanded={isOpen}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
          {initials}
        </span>
        <span className="text-sm text-white/86">{label}</span>
        <ArrowRightSmall className={isOpen ? "ml-auto h-4 w-4 rotate-90 text-white/46" : "ml-auto h-4 w-4 text-white/46"} />
      </button>

      {isOpen ? (
        <div className="absolute bottom-[calc(100%+0.75rem)] left-0 right-0 rounded-2xl border border-white/8 bg-[#090909] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
          <button
            type="button"
            onClick={() => {
              onAction?.();
              router.push(settingsHref);
            }}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/78 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <CogIcon />
            <span>{settingsLabel}</span>
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isPending}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-[#ff6b5d] transition-colors hover:bg-[#ff6b5d]/10 disabled:opacity-60"
          >
            <LogoutIcon />
            <span>{signOutLabel}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function CogIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317a1.724 1.724 0 0 1 3.35 0 1.724 1.724 0 0 0 2.573 1.066 1.724 1.724 0 0 1 2.908 1.678 1.724 1.724 0 0 0 .78 2.343 1.724 1.724 0 0 1 0 3.192 1.724 1.724 0 0 0-.78 2.343 1.724 1.724 0 0 1-2.908 1.678 1.724 1.724 0 0 0-2.573 1.066 1.724 1.724 0 0 1-3.35 0 1.724 1.724 0 0 0-2.573-1.066 1.724 1.724 0 0 1-2.908-1.678 1.724 1.724 0 0 0-.78-2.343 1.724 1.724 0 0 1 0-3.192 1.724 1.724 0 0 0 .78-2.343 1.724 1.724 0 0 1 2.908-1.678 1.724 1.724 0 0 0 2.573-1.066Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25 20.25 12l-4.5 3.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 12H9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h4.5" />
    </svg>
  );
}

function ArrowRightSmall({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6.75 18.75 12l-5.25 5.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 12h13.5" />
    </svg>
  );
}
