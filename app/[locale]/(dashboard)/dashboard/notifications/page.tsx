import { getTranslations, setRequestLocale } from "next-intl/server";

import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { UsersPageHeader } from "@/src/features/admin/components/users-page-header";
import { getDisplayNameFromEmail } from "@/src/features/dashboard/lib/dashboard.utils";
import { getMyNotificationsSafe } from "@/src/features/notifications/api/get-my-notifications";
import { getNotificationsUnreadCountSafe } from "@/src/features/notifications/api/get-notifications-unread-count";
import { NotificationsFilters } from "@/src/features/notifications/components/notifications-filters";
import { NotificationsList } from "@/src/features/notifications/components/notifications-list";
import { parseNotificationsQuery } from "@/src/features/notifications/lib/notifications.query";
import { sortNotificationsUnreadFirst } from "@/src/features/notifications/lib/notifications.utils";

type NotificationsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NotificationsPage({
  params,
  searchParams,
}: NotificationsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const query = parseNotificationsQuery(await searchParams);

  const [t, currentUser, result, unreadCountResult] = await Promise.all([
    getTranslations("NotificationsPage"),
    requireCurrentUser(locale),
    getMyNotificationsSafe(query),
    getNotificationsUnreadCountSafe(),
  ]);
  const response = sortNotificationsUnreadFirst(result.response);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <UsersPageHeader
          title={t("title")}
          description={t("description", {
            name: getDisplayNameFromEmail(currentUser.email),
          })}
        />

        {result.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: result.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        <NotificationsFilters
          locale={locale}
          query={query}
          labels={{
            title: t("filters.title"),
            description: t("filters.description"),
            status: t("filters.status"),
            all: t("filters.all"),
            unread: t("filters.unread"),
            read: t("filters.read"),
            apply: t("filters.apply"),
            reset: t("filters.reset"),
          }}
        />

        <NotificationsList
          locale={locale}
          response={response}
          query={query}
          unreadCount={unreadCountResult.response.count}
          labels={{
            title: t("list.title"),
            description: t("list.description"),
            empty: t("list.empty"),
            page: t("list.page"),
            previous: t("list.previous"),
            next: t("list.next"),
            total: t("list.total"),
            createdAt: t("list.createdAt"),
            status: t("list.status"),
            type: t("list.type"),
            open: t("list.open"),
            unread: t("list.unread"),
            read: t("list.read"),
            itemErrorFallback: t("list.itemErrorFallback"),
            notificationTypes: {
              plan_approved: t("list.notificationTypes.plan_approved"),
              plan_rejected: t("list.notificationTypes.plan_rejected"),
              plan_pending: t("list.notificationTypes.plan_pending"),
              plan_liked: t("list.notificationTypes.plan_liked"),
              plan_saved: t("list.notificationTypes.plan_saved"),
              generic: t("list.notificationTypes.generic"),
            },
            markAllRead: {
              trigger: t("list.markAllRead.trigger"),
              pending: t("list.markAllRead.pending"),
              successPrefix: t("list.markAllRead.successPrefix"),
              nothingToUpdate: t("list.markAllRead.nothingToUpdate"),
              errorFallback: t("list.markAllRead.errorFallback"),
            },
          }}
        />
      </div>
    </main>
  );
}
