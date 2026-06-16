import { getTranslations, setRequestLocale } from "next-intl/server";

import { getCurrentUserSafe } from "@/src/features/auth/api/get-current-user";
import { getGymCoinTransactionsSafe } from "@/src/features/gymcoin/api/get-gymcoin-transactions";
import { getGymCoinWalletSafe } from "@/src/features/gymcoin/api/get-gymcoin-wallet";
import { GymCoinWalletPanel } from "@/src/features/gymcoin/components/gymcoin-wallet-panel";
import { ProfileCard } from "@/src/features/profile/components/profile-card";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, gymCoinT, currentUser, walletResult, transactionsResult] = await Promise.all([
    getTranslations("Profile"),
    getTranslations("GymCoin.wallet"),
    getCurrentUserSafe(),
    getGymCoinWalletSafe(),
    getGymCoinTransactionsSafe(),
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
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <ProfileCard
              user={currentUser}
              labels={{
                title: t("card.title"),
                description: t("card.description"),
                name: t("card.name"),
                nameEmpty: t("card.nameEmpty"),
                id: t("card.id"),
                email: t("card.email"),
                role: t("card.role"),
                createdAt: t("card.createdAt"),
                approvalStatus: t("card.approvalStatus"),
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

            <div className="space-y-6">
              <GymCoinWalletPanel
                userId={currentUser.id}
                locale={locale}
                initialWallet={walletResult}
                initialTransactions={transactionsResult}
                labels={{
                  title: gymCoinT("title"),
                  subtitle: gymCoinT("subtitle"),
                  balance: gymCoinT("balance"),
                  emptyHistory: gymCoinT("emptyHistory"),
                  earned: gymCoinT("earned"),
                  spent: gymCoinT("spent"),
                  unavailable: gymCoinT("unavailable"),
                  transactionTitles: {
                    daily_login_reward: gymCoinT("transactions.daily_login_reward"),
                    welcome_bonus: gymCoinT("transactions.welcome_bonus"),
                    create_training_plan: gymCoinT("transactions.create_training_plan"),
                    create_workout_day: gymCoinT("transactions.create_workout_day"),
                    create_exercise: gymCoinT("transactions.create_exercise"),
                    donation_topup: gymCoinT("transactions.donation_topup"),
                    access_payment: gymCoinT("transactions.access_payment"),
                    top_up: gymCoinT("transactions.top_up"),
                    admin_top_up: gymCoinT("transactions.admin_top_up"),
                    spend_feature: gymCoinT("transactions.spend_feature"),
                  },
                }}
              />

              <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
                <div className="space-y-2">
                  <h2 className="text-[28px] font-semibold tracking-tight text-white">
                    {t("gymCoinGuide.title")}
                  </h2>
                  <p className="text-sm leading-6 text-white/56">
                    {t("gymCoinGuide.description")}
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <GuideItem
                    title={t("gymCoinGuide.earnedTitle")}
                    description={t("gymCoinGuide.earnedDescription")}
                  />
                  <GuideItem
                    title={t("gymCoinGuide.spentTitle")}
                    description={t("gymCoinGuide.spentDescription")}
                  />
                  <GuideItem
                    title={t("gymCoinGuide.rulesTitle")}
                    description={t("gymCoinGuide.rulesDescription")}
                  />
                </div>
              </section>
            </div>
          </div>
        ) : (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error")}
          </section>
        )}
      </div>
    </main>
  );
}

function GuideItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/58">{description}</p>
    </div>
  );
}
