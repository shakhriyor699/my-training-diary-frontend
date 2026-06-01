import { getTranslations, setRequestLocale } from "next-intl/server";

import { getUserByIdSafe } from "@/src/features/admin/api/get-user-by-id";
import { UserDetailsCard } from "@/src/features/admin/components/user-details-card";
import { UserDetailsHeader } from "@/src/features/admin/components/user-details-header";

type UserDetailsPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function UserDetailsPage({
  params,
}: UserDetailsPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const userId = Number.parseInt(id, 10);

  const [t, result] = await Promise.all([
    getTranslations("AdminUserDetails"),
    Number.isFinite(userId) && userId > 0
      ? getUserByIdSafe(userId)
      : Promise.resolve({
          user: null,
          hasError: true,
          errorMessage: "Invalid user id.",
        }),
  ]);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <UserDetailsHeader
          locale={locale}
          labels={{
            back: t("back"),
            title: t("title"),
          }}
        />

        {result.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: result.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        <UserDetailsCard
          user={result.user}
          labels={{
            title: t("card.title"),
            id: t("card.id"),
            email: t("card.email"),
            role: t("card.role"),
            status: t("card.status"),
            rejectionReason: t("card.rejectionReason"),
            noReason: t("card.noReason"),
            createdAt: t("card.createdAt"),
            empty: t("card.empty"),
            emptyDescription: t("card.emptyDescription"),
          }}
        />
      </div>
    </main>
  );
}
