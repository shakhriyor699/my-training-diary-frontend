import { getTranslations, setRequestLocale } from "next-intl/server";

import { AuthForm } from "@/src/features/auth/components/auth-form";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Auth.register");

  return (
    <AuthForm
      mode="register"
      locale={locale}
      title={t("title")}
      description={t("description")}
      submitLabel={t("submit")}
      alternateLabel={t("alternateLabel")}
      alternateHref={`/${locale}/login`}
      alternateText={t("alternateText")}
    />
  );
}
