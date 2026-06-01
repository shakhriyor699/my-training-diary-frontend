import { getTranslations, setRequestLocale } from "next-intl/server";

import { UsersPageHeader } from "@/src/features/admin/components/users-page-header";
import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { getCoachesSafe } from "@/src/features/coaches/api/get-coaches";
import { CoachesFilters } from "@/src/features/coaches/components/coaches-filters";
import { CoachesList } from "@/src/features/coaches/components/coaches-list";
import { parseCoachesQuery } from "@/src/features/coaches/lib/coaches.query";
import { getDisplayNameFromEmail } from "@/src/features/dashboard/lib/dashboard.utils";

type CoachesPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CoachesPage({
  params,
  searchParams,
}: CoachesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = parseCoachesQuery(await searchParams);

  const [t, currentUser, result] = await Promise.all([
    getTranslations("CoachesPage"),
    requireCurrentUser(locale),
    getCoachesSafe(query),
  ]);

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

        <CoachesFilters
          locale={locale}
          query={query}
          labels={{
            title: t("filters.title"),
            description: t("filters.description"),
            search: t("filters.search"),
            searchPlaceholder: t("filters.searchPlaceholder"),
            apply: t("filters.apply"),
            reset: t("filters.reset"),
          }}
        />

        <CoachesList
          coaches={result.coaches}
          labels={{
            title: t("list.title"),
            description: t("list.description"),
            empty: t("list.empty"),
            total: t("list.total"),
            email: t("list.email"),
            role: t("list.role"),
            createdAt: t("list.createdAt"),
            coachRole: t("list.coachRole"),
            request: {
              trigger: t("list.request.trigger"),
              title: t("list.request.title"),
              description: t("list.request.description"),
              messageLabel: t("list.request.messageLabel"),
              messagePlaceholder: t("list.request.messagePlaceholder"),
              submit: t("list.request.submit"),
              submitting: t("list.request.submitting"),
              cancel: t("list.request.cancel"),
              success: t("list.request.success"),
              errorFallback: t("list.request.errorFallback"),
            },
          }}
        />
      </div>
    </main>
  );
}
