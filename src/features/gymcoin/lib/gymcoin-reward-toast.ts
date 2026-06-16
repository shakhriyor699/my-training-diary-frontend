import { toast } from "react-toastify";

import type { GymCoinRewardResponse } from "./gymcoin.types";

export type GymCoinRewardToastLabels = {
  rewarded: string;
  rewardedFallback: string;
  reasons: Record<string, string>;
};

type ShowGymCoinRewardToastOptions = {
  fallbackReasonKey?: string;
};

export function showGymCoinRewardToast(
  reward: GymCoinRewardResponse,
  labels: GymCoinRewardToastLabels,
  options: ShowGymCoinRewardToastOptions = {},
) {
  if (!reward.rewarded || reward.amount <= 0) {
    return;
  }

  const message = buildGymCoinRewardToastMessage(reward, labels, options);
  toast.success(message);
}

function buildGymCoinRewardToastMessage(
  reward: GymCoinRewardResponse,
  labels: GymCoinRewardToastLabels,
  options: ShowGymCoinRewardToastOptions,
) {
  const reason = resolveReasonLabel(reward, labels, options.fallbackReasonKey);

  if (reason) {
    return formatTemplate(labels.rewarded, {
      amount: String(reward.amount),
      reason,
    });
  }

  if (reward.message) {
    return reward.message;
  }

  return formatTemplate(labels.rewardedFallback, {
    amount: String(reward.amount),
  });
}

function resolveReasonLabel(
  reward: GymCoinRewardResponse,
  labels: GymCoinRewardToastLabels,
  fallbackReasonKey?: string,
) {
  const candidates = [reward.reasonKey, reward.title, fallbackReasonKey].filter(
    (value): value is string => Boolean(value),
  );

  for (const candidate of candidates) {
    const translated = labels.reasons[candidate];

    if (translated) {
      return translated;
    }

    if (!looksLikeTranslationKey(candidate)) {
      return candidate;
    }
  }

  return null;
}

function looksLikeTranslationKey(value: string) {
  return /^[a-z0-9_]+$/i.test(value);
}

function formatTemplate(
  template: string,
  replacements: Record<string, string>,
) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    return replacements[key] ?? "";
  });
}
