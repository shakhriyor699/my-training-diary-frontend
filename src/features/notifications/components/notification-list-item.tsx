"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { toast } from "react-toastify";

import { formatDateLabel } from "@/src/features/dashboard/lib/dashboard.utils";
import { markNotificationRead } from "@/src/features/notifications/api/mark-notification-read";
import { getNotificationHref } from "@/src/features/notifications/lib/notifications-routing";

import type { NotificationItem } from "../lib/notifications.types";

type NotificationListItemProps = {
  locale: string;
  notification: NotificationItem;
  labels: {
    createdAt: string;
    status: string;
    type: string;
    unread: string;
    read: string;
    notificationTypes: Record<string, string>;
    open: string;
    errorFallback: string;
  };
};

export function NotificationListItem({
  locale,
  notification,
  labels,
}: NotificationListItemProps) {
  const router = useRouter();
  const href = getNotificationHref(locale);

  const mutation = useMutation({
    mutationFn: () => markNotificationRead(notification.id),
    onSuccess: () => {
      startTransition(() => {
        router.push(href);
        router.refresh();
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : labels.errorFallback;
      toast.error(message);
    },
  });

  function handleOpen() {
    if (notification.isRead) {
      startTransition(() => {
        router.push(href);
      });
      return;
    }

    mutation.mutate();
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      disabled={mutation.isPending}
      className="w-full rounded-[20px] border border-white/8 bg-black/20 p-5 text-left transition-colors hover:border-white/16 hover:bg-black/28 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
              ID {notification.id}
            </span>
            <NotificationStatusBadge
              isRead={notification.isRead}
              labels={{ read: labels.read, unread: labels.unread }}
            />
            <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
              {labels.notificationTypes[notification.type] ?? notification.type}
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-white">
              {notification.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-white/64">
              {notification.message}
            </p>
          </div>
        </div>

        <div className="grid min-w-[260px] gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] p-4 text-sm text-white/64">
          <Metric label={labels.createdAt} value={formatDateLabel(notification.createdAt)} />
          <Metric
            label={labels.status}
            value={notification.isRead ? labels.read : labels.unread}
          />
          <Metric
            label={labels.type}
            value={labels.notificationTypes[notification.type] ?? notification.type}
          />
          <Metric
            label={labels.open}
            value={mutation.isPending ? labels.unread : labels.open}
          />
        </div>
      </div>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-white/36">{label}</p>
      <p className="mt-1 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

function NotificationStatusBadge({
  isRead,
  labels,
}: {
  isRead: boolean;
  labels: { unread: string; read: string };
}) {
  const className = isRead
    ? "border-white/10 bg-white/[0.04] text-white/62"
    : "border-[#fa614d]/20 bg-[#fa614d]/12 text-[#ffb0a8]";

  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
        className,
      ].join(" ")}
    >
      {isRead ? labels.read : labels.unread}
    </span>
  );
}
