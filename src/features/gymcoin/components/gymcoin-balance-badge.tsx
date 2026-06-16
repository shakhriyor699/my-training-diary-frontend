"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import gymcoinIcon from "@/src/shared/assets/icons/gymcoins_icon.svg";

import { getGymCoinWalletClient } from "../api/gymcoin-client";
import { getGymCoinWalletQueryKey } from "../lib/gymcoin.constants";
import type { GymCoinWalletResult } from "../lib/gymcoin.types";

type GymCoinBalanceBadgeProps = {
  userId: number;
  initialWallet: GymCoinWalletResult;
  label: string;
};

export function GymCoinBalanceBadge({
  userId,
  initialWallet,
  label,
}: GymCoinBalanceBadgeProps) {
  const walletQuery = useQuery({
    queryKey: getGymCoinWalletQueryKey(userId),
    queryFn: getGymCoinWalletClient,
    initialData: initialWallet.wallet,
  });

  return (
    <div className="inline-flex items-center gap-3 rounded-[22px] border border-[#f5b800]/30 bg-[linear-gradient(135deg,rgba(255,224,102,0.24),rgba(245,184,0,0.18)_35%,rgba(14,11,5,0.96)_100%)] px-3.5 py-2.5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.34)] backdrop-blur-xl ring-1 ring-white/6">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-[radial-gradient(circle_at_30%_30%,rgba(255,248,192,0.55),rgba(245,184,0,0.18)_45%,rgba(0,0,0,0.08)_100%)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,224,102,0.25),transparent_70%)]" />
        <Image
          src={gymcoinIcon}
          alt=""
          className="h-full w-full object-contain drop-shadow-[0_6px_12px_rgba(122,74,0,0.4)]"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/52">
          {label}
        </p>
        <p className="text-base font-semibold tracking-tight text-[#fff1a6]">
          {walletQuery.data.balance}
        </p>
      </div>
    </div>
  );
}
