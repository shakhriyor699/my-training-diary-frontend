import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

import { UsersPageHeader } from "@/src/features/admin/components/users-page-header";
import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { getMyCoachStudentsSafe } from "@/src/features/coaches/api/get-my-coach-students";
import { getCoachStudentSessionsSafe } from "@/src/features/coaches/api/get-coach-student-sessions";
import { CoachStudentSessionsList } from "@/src/features/coaches/components/coach-student-sessions-list";
import { parseCoachStudentSessionsQuery } from "@/src/features/coaches/lib/coach-student-sessions.query";
import { getDisplayNameFromEmail } from "@/src/features/dashboard/lib/dashboard.utils";

type CoachStudentSessionsPageProps = {
  params: Promise<{
    locale: string;
    studentId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CoachStudentSessionsPage({
  params,
  searchParams,
}: CoachStudentSessionsPageProps) {
  const { locale, studentId } = await params;
  setRequestLocale(locale);

  const query = parseCoachStudentSessionsQuery(await searchParams);
  const parsedStudentId = Number.parseInt(studentId, 10);
  const currentUser = await requireCurrentUser(locale);

  const [t, studentsResult, sessionsResult] = await Promise.all([
    getTranslations("CoachStudentSessionsPage"),
    getCoachStudentsForUser(currentUser.role),
    Number.isFinite(parsedStudentId) && parsedStudentId > 0 && currentUser.role === "coach"
      ? getCoachStudentSessionsSafe(parsedStudentId, query)
      : Promise.resolve({
          response: {
            data: [],
            meta: {
              total: 0,
              page: query.page,
              limit: query.limit,
              totalPages: 1,
            },
          },
          hasError: true,
          errorMessage: "Student id is invalid.",
        }),
  ]);

  const studentLink =
    studentsResult.students.find((entry) => entry.studentId === parsedStudentId) ?? null;
  const studentName = studentLink
    ? getDisplayNameFromEmail(studentLink.student.email)
    : t("unknownStudent");

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <UsersPageHeader
            title={t("title", { student: studentName })}
            description={t("description", {
              coach: getDisplayNameFromEmail(currentUser.email),
            })}
          />

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/dashboard/my-coach/students/${studentId}`}
              className="inline-flex h-11 items-center justify-center rounded-[12px] border border-white/14 bg-transparent px-5 text-sm font-medium text-white/82 transition hover:bg-white/[0.04] hover:text-white"
            >
              {t("backToStats")}
            </Link>
            <Link
              href={`/${locale}/dashboard/my-coach`}
              className="inline-flex h-11 items-center justify-center rounded-[12px] border border-white/14 bg-transparent px-5 text-sm font-medium text-white/82 transition hover:bg-white/[0.04] hover:text-white"
            >
              {t("back")}
            </Link>
          </div>
        </div>

        {studentsResult.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("studentsError", {
              message: studentsResult.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        {sessionsResult.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: sessionsResult.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        <CoachStudentSessionsList
          locale={locale}
          studentId={Number.isFinite(parsedStudentId) ? parsedStudentId : 0}
          response={sessionsResult.response}
          query={query}
          labels={{
            title: t("list.title"),
            description: t("list.description"),
            empty: t("list.empty"),
            page: t("list.page"),
            previous: t("list.previous"),
            next: t("list.next"),
            plan: t("list.plan"),
            date: t("list.date"),
            totalSets: t("list.totalSets"),
            totalVolume: t("list.totalVolume"),
            setLogs: t("list.setLogs"),
            set: t("list.set"),
            weight: t("list.weight"),
            reps: t("list.reps"),
            rir: t("list.rir"),
            exercise: t("list.exercise"),
            muscleGroup: t("list.muscleGroup"),
          }}
        />
      </div>
    </main>
  );
}

async function getCoachStudentsForUser(role: string) {
  if (role !== "coach" && role !== "admin") {
    return {
      students: [],
      hasError: true,
      errorMessage: "Coach access only.",
    };
  }

  return getMyCoachStudentsSafe();
}
