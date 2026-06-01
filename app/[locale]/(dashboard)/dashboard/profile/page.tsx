import { getTranslations, setRequestLocale } from "next-intl/server";

import { getCurrentUserSafe } from "@/src/features/auth/api/get-current-user";
import { ProfileCard } from "@/src/features/profile/components/profile-card";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, currentUser] = await Promise.all([
    getTranslations("Profile"),
    getCurrentUserSafe(),
  ]);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {t("title")}
          </h1>
          <p className="text-lg text-white/46">{t("description")}</p>
        </header>

        {currentUser ? (
          <ProfileCard
            user={currentUser}
            labels={{
              title: t("card.title"),
              description: t("card.description"),
              id: t("card.id"),
              email: t("card.email"),
              role: t("card.role"),
              createdAt: t("card.createdAt"),
              edit: {
                trigger: t("card.edit.trigger"),
                title: t("card.edit.title"),
                description: t("card.edit.description"),
                email: t("card.edit.email"),
                emailPlaceholder: t("card.edit.emailPlaceholder"),
                password: t("card.edit.password"),
                passwordPlaceholder: t("card.edit.passwordPlaceholder"),
                role: t("card.edit.role"),
                submit: t("card.edit.submit"),
                submitting: t("card.edit.submitting"),
                cancel: t("card.edit.cancel"),
                errorFallback: t("card.edit.errorFallback"),
                success: t("card.edit.success"),
              },
            }}
          />
        ) : (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error")}
          </section>
        )}
      </div>
    </main>
  );
}
