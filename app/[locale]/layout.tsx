import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { QueryProvider } from "@/src/shared/providers/query-provider";
import { ToastProvider } from "@/src/shared/providers/toast-provider";
import { LanguageSwitcher } from "@/src/shared/components/language-switcher";
import { routing } from "@/src/i18n/routing";

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>
        <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
          <Suspense fallback={null}>
            <LanguageSwitcher locale={locale} />
          </Suspense>
        </div>
        <ToastProvider />
        {children}
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
