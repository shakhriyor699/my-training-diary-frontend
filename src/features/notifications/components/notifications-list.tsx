import Link from "next/link";

import { formatInteger } from "@/src/features/dashboard/lib/dashboard.utils";
import { toNotificationsSearchParams } from "@/src/features/notifications/lib/notifications.query";
import { MarkAllNotificationsReadButton } from "@/src/features/notifications/components/mark-all-notifications-read-button";
import { NotificationListItem } from "@/src/features/notifications/components/notification-list-item";

import type {
  NotificationsQuery,
  NotificationsResponse,
} from "../lib/notifications.types";

type NotificationsListProps = {
  locale: string;
  response: NotificationsResponse;
  query: NotificationsQuery;
  unreadCount: number;
  labels: {
    title: string;
    description: string;
    empty: string;
    page: string;
    previous: string;
    next: string;
    total: string;
    createdAt: string;
    status: string;
    type: string;
    unread: string;
    read: string;
    notificationTypes: Record<string, string>;
    open: string;
    itemErrorFallback: string;
    markAllRead: {
      trigger: string;
      pending: string;
      successPrefix: string;
      nothingToUpdate: string;
      errorFallback: string;
    };
  };
};

export function NotificationsList({
  locale,
  response,
  query,
  unreadCount,
  labels,
}: NotificationsListProps) {
  const previousPage = Math.max(response.meta.page - 1, 1);
  const nextPage = Math.min(response.meta.page + 1, response.meta.totalPages);

  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
          <p className="mt-1 text-lg text-white/42">{labels.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/72">
            {labels.total}: {formatInteger(response.meta.total)}
          </div>
          <MarkAllNotificationsReadButton
            unreadCount={unreadCount}
            labels={labels.markAllRead}
          />
        </div>
      </div>

      {response.data.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
          {labels.empty}
        </div>
      ) : (
        <div className="space-y-4">
          {response.data.map((notification) => (
            <NotificationListItem
              key={notification.id}
              locale={locale}
              notification={notification}
              labels={{
                createdAt: labels.createdAt,
                status: labels.status,
                type: labels.type,
                unread: labels.unread,
                read: labels.read,
                notificationTypes: labels.notificationTypes,
                open: labels.open,
                errorFallback: labels.itemErrorFallback,
              }}
            />
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/45">
          {labels.page} {response.meta.page} / {response.meta.totalPages}
        </p>
        <div className="flex gap-2">
          <PaginationLink
            locale={locale}
            query={{ ...query, page: previousPage }}
            disabled={response.meta.page <= 1}
            label={labels.previous}
          />
          <PaginationLink
            locale={locale}
            query={{ ...query, page: nextPage }}
            disabled={response.meta.page >= response.meta.totalPages}
            label={labels.next}
          />
        </div>
      </div>
    </section>
  );
}

function PaginationLink({
  locale,
  query,
  disabled,
  label,
}: {
  locale: string;
  query: NotificationsQuery;
  disabled: boolean;
  label: string;
}) {
  const href = `/${locale}/dashboard/notifications?${toNotificationsSearchParams(query)}`;

  if (disabled) {
    return (
      <span className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm text-white/28">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
    >
      {label}
    </Link>
  );
}
