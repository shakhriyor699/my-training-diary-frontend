import { getTranslations, setRequestLocale } from "next-intl/server";

import { getCurrentUserSafe } from "@/src/features/auth/api/get-current-user";
import { DashboardShell } from "@/src/features/dashboard/components/dashboard-shell";
import {
  getDisplayNameFromEmail,
  getInitials,
} from "@/src/features/dashboard/lib/dashboard.utils";
import { getGymCoinWalletSafe } from "@/src/features/gymcoin/api/get-gymcoin-wallet";
import { getNotificationsUnreadCountSafe } from "@/src/features/notifications/api/get-notifications-unread-count";

type DashboardLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

const PRIMARY_NAV = [
  { key: "home", href: "dashboard", activePath: "/dashboard", icon: "home" },
  { key: "plans", href: "dashboard/plans", activePath: "/dashboard/plans", icon: "calendar" },
  { key: "nutrition", href: "dashboard/nutrition", activePath: "/dashboard/nutrition", icon: "calendar" },
  { key: "favorites", href: "dashboard/favorites", activePath: "/dashboard/favorites", icon: "bookmark" },
  { key: "sessions", href: "dashboard/sessions", activePath: "/dashboard/sessions", icon: "list" },
  { key: "workouts", href: "dashboard/workouts", activePath: "/dashboard/workouts", icon: "bolt" },
  { key: "progress", href: "dashboard/progress", activePath: "/dashboard/progress", icon: "trend" },
  { key: "analytics", href: "dashboard", activePath: "/dashboard/analytics", icon: "chart" },
] as const;

const COMMUNITY_NAV = [
  { key: "findCoaches", href: "dashboard/coaches", activePath: "/dashboard/coaches", icon: "users" },
  { key: "myCoach", href: "dashboard/my-coach", activePath: "/dashboard/my-coach", icon: "userCheck" },
  { key: "notifications", href: "dashboard/notifications", activePath: "/dashboard/notifications", icon: "bell" },
] as const;

const ADMIN_NAV = [
  { key: "users", href: "dashboard/users", activePath: "/dashboard/users", icon: "users" },
  { key: "moderation", href: "dashboard/moderation", activePath: "/dashboard/moderation", icon: "shield" },
  { key: "settings", href: "dashboard/profile", activePath: "/dashboard/profile", icon: "cog" },
] as const;

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [
    t,
    gymCoinT,
    profile,
    unreadNotificationsResult,
    walletResult,
  ] = await Promise.all([
    getTranslations("Dashboard.nav"),
    getTranslations("GymCoin"),
    getCurrentUserSafe(),
    getNotificationsUnreadCountSafe(),
    getGymCoinWalletSafe(),
  ]);
  const displayName = profile ? getDisplayNameFromEmail(profile.email) : "User";
  const initials = getInitials(displayName);
  const primaryItems = PRIMARY_NAV.filter((item) => {
    if (item.key !== "nutrition") {
      return true;
    }

    return profile?.role === "user" || profile?.role === "admin";
  });
  const adminItems =
    profile?.role === "admin" || profile?.role === "moderator" ? ADMIN_NAV : [];
  const communityItems = COMMUNITY_NAV.filter((item) => {
    if (item.key !== "myCoach") {
      return true;
    }

    return profile?.role === "user" || profile?.role === "admin";
  });
  const mainLabels = createNavLabels(t, primaryItems);
  const communityLabels = createNavLabels(t, communityItems);
  const adminLabels = createNavLabels(t, adminItems);
  const communityBadgeCounts = {
    myCoach: 0,
    notifications: unreadNotificationsResult.response.count,
  };

  return (
    <DashboardShell
      locale={locale}
      displayName={displayName}
      initials={initials}
      settingsHref={`/${locale}/dashboard/profile`}
      settingsLabel={t("profileSettings")}
      signOutLabel={t("signOut")}
      mainTitle={t("main")}
      communityTitle={t("community")}
      adminTitle={t("admin")}
      primaryItems={primaryItems}
      communityItems={communityItems}
      adminItems={adminItems}
      mainLabels={mainLabels}
      communityLabels={communityLabels}
      adminLabels={adminLabels}
      communityBadgeCounts={communityBadgeCounts}
      currentUserId={profile?.id ?? 0}
      gymCoinWallet={walletResult}
      gymCoinLabels={{
        badge: gymCoinT("wallet.badge"),
        rewarded: gymCoinT.raw("toast.rewarded"),
        rewardedFallback: gymCoinT.raw("toast.rewardedFallback"),
        reasons: {
          daily_login_reward: gymCoinT("toast.reasons.daily_login_reward"),
          welcome_bonus: gymCoinT("toast.reasons.welcome_bonus"),
          training_session_reward: gymCoinT("toast.reasons.training_session_reward"),
          training_completion_reward: gymCoinT("toast.reasons.training_completion_reward"),
          completed_training: gymCoinT("toast.reasons.completed_training"),
          record_training_session: gymCoinT("toast.reasons.record_training_session"),
        },
      }}
    >
      {children}
    </DashboardShell>
  );
}

function createNavLabels(
  t: Awaited<ReturnType<typeof getTranslations>>,
  items: readonly { key: string }[],
) {
  return Object.fromEntries(items.map((item) => [item.key, t(item.key)]));
}
