import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

type LocaleHomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleHomePage({
  params,
}: LocaleHomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");

  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(60,179,113,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.1),transparent_24%),linear-gradient(180deg,#060606_0%,#0a0a0a_54%,#050505_100%)]" />
      <section className="relative w-full max-w-6xl overflow-hidden rounded-[40px] border border-white/8 bg-black/70 px-7 py-8 text-white shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-10 sm:py-10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_35%,transparent_70%,rgba(34,197,94,0.08))]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-7">
            <div className="space-y-4">
              <span className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-white/72">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#d8f76d,#a3e635_45%,#16a34a)] font-semibold text-black">
                  TD
                </span>
                {t("guest")}
              </span>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  {t("title")}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/64 sm:text-lg">
                  {t("description")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/register`}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#1cc31c] px-6 text-sm font-semibold text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#28d928]"
              >
                {t("register")}
              </Link>
              <Link
                href={`/${locale}/login`}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
              >
                {t("login")}
              </Link>
              <Link
                href={`/${locale}/training-plans`}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#1cc31c]/18 bg-[#1cc31c]/10 px-6 text-sm font-semibold text-[#96f59f] transition-colors duration-200 hover:bg-[#1cc31c]/16"
              >
                {t("viewPlans")}
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[26px] border border-white/8 bg-white/[0.04] p-4">
                <p className="text-sm font-medium text-white">{t("featureOne")}</p>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {t("featureOneDescription")}
                </p>
              </div>
              <div className="rounded-[26px] border border-white/8 bg-white/[0.04] p-4">
                <p className="text-sm font-medium text-white">{t("featureTwo")}</p>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {t("featureTwoDescription")}
                </p>
              </div>
              <div className="rounded-[26px] border border-white/8 bg-white/[0.04] p-4">
                <p className="text-sm font-medium text-white">{t("featureThree")}</p>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {t("featureThreeDescription")}
                </p>
              </div>
            </div>
          </div>

          <div className="td-float relative overflow-hidden rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-24 rounded-full bg-[#1cc31c]/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 top-16 h-40 w-40 rounded-full bg-[#1cc31c]/8 blur-3xl" />
            <div className="relative rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_32%),#0d0d0d] p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/45">{t("previewLabel")}</p>
                  <h2 className="mt-1 text-xl font-semibold">{t("previewTitle")}</h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#1cc31c]/18 bg-[#1cc31c]/14 px-3 py-1 text-xs font-semibold text-[#4ade80] shadow-[0_0_24px_rgba(28,195,28,0.12)]">
                  <span className="td-pulse-ring relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
                  Live
                </span>
              </div>

              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-[26px] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.025))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-[#1cc31c]/10 blur-2xl" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/45">{t("previewCardTitle")}</p>
                      <div className="mt-2 flex items-end gap-2">
                        <p className="text-3xl font-semibold tracking-tight">4 / 5</p>
                        <span className="pb-1 text-xs font-medium uppercase tracking-[0.24em] text-[#7ee787]">
                          strong
                        </span>
                      </div>
                    </div>
                    <div className="relative flex h-16 w-16 items-center justify-center">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "conic-gradient(#1cc31c 0deg 288deg, rgba(255,255,255,0.08) 288deg 360deg)",
                        }}
                      />
                      <div className="absolute inset-[7px] rounded-full bg-[#0f0f0f]" />
                      <div className="relative text-sm font-semibold text-white">80%</div>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[26px] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="mb-3 flex items-center justify-between text-sm text-white/62">
                    <span>{t("previewRowOne")}</span>
                    <span className="font-semibold text-white/88">86%</span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
                    <div className="td-progress-shimmer relative h-full w-[86%] rounded-full bg-[linear-gradient(90deg,#149414_0%,#1cc31c_55%,#68f768_100%)]" />
                  </div>

                  <div className="mt-5 grid gap-3">
                    <div className="flex items-center justify-between rounded-2xl border border-white/6 bg-black/20 px-3 py-2.5 text-sm text-white/70">
                      <span>{t("previewRowTwo")}</span>
                      <span className="font-semibold text-white">12</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/6 bg-black/20 px-3 py-2.5 text-sm text-white/70">
                      <span>{t("previewRowThree")}</span>
                      <span className="font-semibold text-[#7ee787]">7d</span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-7 gap-1.5">
                    {["64%", "82%", "58%", "91%", "74%", "88%", "100%"].map(
                      (height, index) => (
                        <div
                          key={height}
                          className="flex h-16 items-end rounded-2xl border border-white/5 bg-white/[0.025] p-1"
                        >
                          <div
                            className={[
                              "w-full rounded-xl bg-[linear-gradient(180deg,rgba(126,231,135,0.95),rgba(28,195,28,0.65))]",
                              index === 6 ? "shadow-[0_0_18px_rgba(28,195,28,0.35)]" : "",
                            ].join(" ")}
                            style={{ height }}
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
