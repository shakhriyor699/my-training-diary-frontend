"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import gymcoinIcon from "@/src/shared/assets/icons/gymcoins_icon.svg";

import {
  getGymCoinTransactionsClient,
  getGymCoinWalletClient,
} from "../api/gymcoin-client";
import {
  getGymCoinTransactionsQueryKey,
  getGymCoinWalletQueryKey,
} from "../lib/gymcoin.constants";
import type {
  GymCoinTransaction,
  GymCoinTransactionsResult,
  GymCoinWalletResult,
} from "../lib/gymcoin.types";

type GymCoinWalletPanelProps = {
  userId: number;
  locale: string;
  initialWallet: GymCoinWalletResult;
  initialTransactions: GymCoinTransactionsResult;
  labels: {
    title: string;
    subtitle: string;
    balance: string;
    emptyHistory: string;
    earned: string;
    spent: string;
    unavailable: string;
    transactionTitles: Record<string, string>;
  };
};

export function GymCoinWalletPanel({
  userId,
  locale,
  initialWallet,
  initialTransactions,
  labels,
}: GymCoinWalletPanelProps) {
  const walletQuery = useQuery({
    queryKey: getGymCoinWalletQueryKey(userId),
    queryFn: getGymCoinWalletClient,
    initialData: initialWallet.wallet,
  });
  const transactionsQuery = useQuery({
    queryKey: getGymCoinTransactionsQueryKey(userId),
    queryFn: getGymCoinTransactionsClient,
    initialData: initialTransactions.transactions,
  });

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#f5b800]/22 bg-[linear-gradient(180deg,rgba(255,224,102,0.18),rgba(245,184,0,0.1)_22%,rgba(9,9,9,0.94)_58%,rgba(9,9,9,0.99))] shadow-[0_28px_90px_rgba(0,0,0,0.32)] ring-1 ring-white/6">
      <div className="border-b border-white/8 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-16 items-center justify-center rounded-full border border-white/12 bg-[radial-gradient(circle_at_30%_30%,rgba(255,248,192,0.62),rgba(245,184,0,0.18)_46%,rgba(0,0,0,0.08)_100%)] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
            <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,224,102,0.28),transparent_70%)]" />
            <Image
              src={gymcoinIcon}
              alt=""
              className="h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(122,74,0,0.45)]"
            />
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold tracking-tight text-white">{labels.title}</p>
            <p className="text-sm text-white/60">{labels.subtitle}</p>
          </div>
        </div>

        <div className="mt-4 rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,224,102,0.12),rgba(0,0,0,0.24))] px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/46">
            {labels.balance}
          </p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-[#fff1a6]">
            {walletQuery.data.balance}
          </p>
        </div>

        {initialWallet.hasError || initialTransactions.hasError ? (
          <p className="mt-3 text-xs leading-5 text-[#fde68a]">{labels.unavailable}</p>
        ) : null}
      </div>

      <div className="max-h-[280px] space-y-3 overflow-y-auto px-4 py-4">
        {transactionsQuery.data.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-4 py-5 text-sm text-white/52">
            {labels.emptyHistory}
          </div>
        ) : (
          transactionsQuery.data.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              locale={locale}
              transaction={transaction}
              labels={labels}
            />
          ))
        )}
      </div>
    </section>
  );
}

function TransactionRow({
  locale,
  transaction,
  labels,
}: {
  locale: string;
  transaction: GymCoinTransaction;
  labels: GymCoinWalletPanelProps["labels"];
}) {
  const isEarned = transaction.amount >= 0;

  return (
    <article className="rounded-[18px] border border-white/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {formatTransactionText(transaction.title, labels.transactionTitles)}
          </p>
          <p className="mt-1 text-xs text-white/54">
            {transaction.createdAt
              ? formatDateLabel(transaction.createdAt, locale)
              : labels.unavailable}
          </p>
        </div>
        <div className="text-right">
          <p
            className={[
              "text-sm font-semibold",
              isEarned ? "text-[#7ee787]" : "text-[#ffb86c]",
            ].join(" ")}
          >
            {isEarned ? "+" : ""}
            {transaction.amount}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/40">
            {isEarned ? labels.earned : labels.spent}
          </p>
        </div>
      </div>
      {transaction.description ? (
        <p className="mt-2 text-xs leading-5 text-white/62">
          {formatTransactionText(transaction.description, labels.transactionTitles)}
        </p>
      ) : null}
    </article>
  );
}

function formatTransactionText(
  value: string,
  transactionTitles: Record<string, string>,
) {
  const normalizedValue = normalizeTransactionKey(value);

  if (transactionTitles[normalizedValue]) {
    return transactionTitles[normalizedValue];
  }

  if (/^[a-z0-9_]+$/.test(normalizedValue)) {
    return normalizedValue
      .split("_")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  return value;
}

function normalizeTransactionKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function formatDateLabel(value: string, locale: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
