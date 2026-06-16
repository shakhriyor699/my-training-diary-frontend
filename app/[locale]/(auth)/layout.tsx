import { getTranslations } from "next-intl/server";

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth.layout" });

  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-5 py-8 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(80,220,120,0.16),transparent_25%),linear-gradient(180deg,#050505_0%,#090909_60%,#040404_100%)]" />
      <div className="relative grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-10 text-white shadow-[0_36px_120px_rgba(0,0,0,0.35)] lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#d8f76d,#a3e635_45%,#16a34a)] text-lg font-semibold text-black">
                TD
              </span>
              <span className="text-2xl font-semibold tracking-tight">
                Training Diary
              </span>
            </div>
            <div className="space-y-4">
              <h2 className="max-w-md text-5xl font-semibold leading-tight tracking-tight">
                {t("title")}
              </h2>
              <p className="max-w-lg text-base leading-7 text-white/62">
                {t("description")}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/8 bg-white/[0.04] p-5">
              <p className="text-sm font-medium text-white">{t("cardOneTitle")}</p>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {t("cardOneDescription")}
              </p>
            </div>
            <div className="rounded-[28px] border border-white/8 bg-white/[0.04] p-5">
              <p className="text-sm font-medium text-white">{t("cardTwoTitle")}</p>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {t("cardTwoDescription")}
              </p>
            </div>
          </div>
        </section>
        <section>{children}</section>
      </div>
    </main>
  );
}
