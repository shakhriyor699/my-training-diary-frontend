import { getTranslations, setRequestLocale } from "next-intl/server";

import { UsersPageHeader } from "@/src/features/admin/components/users-page-header";
import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { getMyCoachRequestsSafe } from "@/src/features/coaches/api/get-my-coach-requests";
import { getMyCoachStudentsSafe } from "@/src/features/coaches/api/get-my-coach-students";
import { CoachRequestsList } from "@/src/features/coaches/components/coach-requests-list";
import { CoachStudentsList } from "@/src/features/coaches/components/coach-students-list";
import { getDisplayNameFromEmail } from "@/src/features/dashboard/lib/dashboard.utils";

type MyCoachPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MyCoachPage({ params }: MyCoachPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const currentUser = await requireCurrentUser(locale);

  const [t, requestsResult, studentsResult] = await Promise.all([
    getTranslations("MyCoachPage"),
    getCoachRequestsForUser(currentUser.role),
    getCoachStudentsForUser(currentUser.role),
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

        {requestsResult.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: requestsResult.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        {studentsResult.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("studentsError", {
              message: studentsResult.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        <CoachRequestsList
          requests={requestsResult.requests}
          labels={{
            title: t("list.title"),
            description: t("list.description"),
            empty: t("list.empty"),
            total: t("list.total"),
            student: t("list.student"),
            email: t("list.email"),
            status: t("list.status"),
            createdAt: t("list.createdAt"),
            message: t("list.message"),
            statuses: {
              pending: t("list.statuses.pending"),
              accepted: t("list.statuses.accepted"),
              rejected: t("list.statuses.rejected"),
            },
            actions: {
              accept: t("list.actions.accept"),
              accepting: t("list.actions.accepting"),
              reject: t("list.actions.reject"),
              rejecting: t("list.actions.rejecting"),
              acceptSuccess: t("list.actions.acceptSuccess"),
              rejectSuccess: t("list.actions.rejectSuccess"),
              errorFallback: t("list.actions.errorFallback"),
            },
          }}
        />

        <CoachStudentsList
          locale={locale}
          students={studentsResult.students}
          labels={{
            title: t("students.title"),
            description: t("students.description"),
            empty: t("students.empty"),
            total: t("students.total"),
            student: t("students.student"),
            email: t("students.email"),
            role: t("students.role"),
            createdAt: t("students.createdAt"),
            accepted: t("students.accepted"),
            viewStats: t("students.viewStats"),
            viewSessions: t("students.viewSessions"),
          }}
        />
      </div>
    </main>
  );
}

async function getCoachRequestsForUser(role: string) {
  if (role !== "coach" && role !== "admin") {
    return {
      requests: [],
      hasError: true,
      errorMessage: "Coach access only.",
    };
  }

  return getMyCoachRequestsSafe();
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
