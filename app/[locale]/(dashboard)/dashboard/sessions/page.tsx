import { getTranslations, setRequestLocale } from "next-intl/server";

import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { UsersPageHeader } from "@/src/features/admin/components/users-page-header";
import { getDisplayNameFromEmail } from "@/src/features/dashboard/lib/dashboard.utils";
import { getMyTrainingSessionsSafe } from "@/src/features/training-plans/api/get-my-training-sessions";
import { getTrainingSessionByIdSafe } from "@/src/features/training-plans/api/get-training-session-by-id";
import { MyTrainingSessionsList } from "@/src/features/training-plans/components/my-training-sessions-list";
import type {
  MyTrainingSession,
  MyTrainingSessionsQuery,
  MyTrainingSessionsResponse,
} from "@/src/features/training-plans/lib/training-plans.types";

type MyTrainingSessionsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MyTrainingSessionsPage({
  params,
  searchParams,
}: MyTrainingSessionsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const query = parseSessionsQuery(await searchParams);
  const [t, currentUser, result] = await Promise.all([
    getTranslations("TrainingSessions"),
    requireCurrentUser(locale),
    getMyTrainingSessionsSafe(query),
  ]);
  const response = await hydrateTrainingSessions(result.response);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 text-white sm:px-8 lg:px-8">
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

        <MyTrainingSessionsList
          locale={locale}
          response={response}
          query={query}
          labels={{
            title: t("list.title"),
            description: t("list.description"),
            empty: t("list.empty"),
            page: t("list.page"),
            previous: t("list.previous"),
            next: t("list.next"),
            workoutDay: t("list.workoutDay"),
            date: t("list.date"),
            totalSets: t("list.totalSets"),
            totalVolume: t("list.totalVolume"),
            exerciseLogs: t("list.exerciseLogs"),
            set: t("list.set"),
            weight: t("list.weight"),
            reps: t("list.reps"),
            rir: t("list.rir"),
            note: t("list.note"),
            target: t("list.target"),
          }}
        />
      </div>
    </main>
  );
}

async function hydrateTrainingSessions(
  response: MyTrainingSessionsResponse,
): Promise<MyTrainingSessionsResponse> {
  const detailedSessions = await Promise.all(
    response.data.map(async (session) => {
      if (!session.id) {
        return session;
      }

      const detailedResult = await getTrainingSessionByIdSafe(session.id);
      return mergeSessionSummary(session, detailedResult.session);
    }),
  );

  return {
    ...response,
    data: detailedSessions,
  };
}

function mergeSessionSummary(
  summary: MyTrainingSession,
  detailed: MyTrainingSession | null,
): MyTrainingSession {
  if (!detailed) {
    return summary;
  }

  return {
    ...summary,
    ...detailed,
    workoutDay: {
      ...summary.workoutDay,
      ...detailed.workoutDay,
    },
    exerciseLogs:
      detailed.exerciseLogs.length > 0 ? detailed.exerciseLogs : summary.exerciseLogs,
  };
}

function parseSessionsQuery(
  searchParams: Record<string, string | string[] | undefined>,
): MyTrainingSessionsQuery {
  const page = getPositiveInteger(getSingleParam(searchParams.page)) ?? 1;
  const limit = getPositiveInteger(getSingleParam(searchParams.limit)) ?? 10;

  return {
    page,
    limit: Math.min(limit, 50),
  };
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getPositiveInteger(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return undefined;
  }

  return parsed;
}
