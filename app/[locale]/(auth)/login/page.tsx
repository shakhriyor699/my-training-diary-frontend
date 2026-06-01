import { getTranslations, setRequestLocale } from "next-intl/server";

import { AuthForm } from "@/src/features/auth/components/auth-form";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Auth.login");

  return (
    <AuthForm
      mode="login"
      locale={locale}
      title={t("title")}
      description={t("description")}
      submitLabel={t("submit")}
      alternateLabel={t("alternateLabel")}
      alternateHref={`/${locale}/register`}
      alternateText={t("alternateText")}
    />
  );
}
