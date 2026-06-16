"use client";

type GymCoinFeatureAccessPanelProps = {
  title: string;
  description: string;
  checkingLabel: string;
  insufficientLabel: string;
  unavailableLabel: string;
  requiredCoins: number;
  allowed: boolean | undefined;
  missingCoins: number;
  balance: number | null;
  isLoading: boolean;
};

export function GymCoinFeatureAccessPanel({
  title,
  description,
  checkingLabel,
  insufficientLabel,
  unavailableLabel,
  requiredCoins,
  allowed,
  missingCoins,
  balance,
  isLoading,
}: GymCoinFeatureAccessPanelProps) {
  const toneClassName =
    allowed === false
      ? "border-[#ffb86c]/24 bg-[#ffb86c]/10 text-[#ffe2b8]"
      : "border-[#f5b800]/20 bg-[#f5b800]/10 text-white/80";

  const statusText = isLoading
    ? checkingLabel
    : allowed === false
      ? `${insufficientLabel} ${missingCoins}`
      : balance === null
        ? unavailableLabel
        : `GymCoin: ${balance}`;

  return (
    <div className={["rounded-2xl border px-4 py-4", toneClassName].join(" ")}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-sm text-white/60">{description}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#ffe066]">
          {requiredCoins}
        </span>
      </div>
      <p className="mt-3 text-sm text-white/68">{statusText}</p>
    </div>
  );
}
