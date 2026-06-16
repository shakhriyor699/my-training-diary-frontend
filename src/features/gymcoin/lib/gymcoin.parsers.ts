import type {
  GymCoinAccessCheck,
  GymCoinFeatureSpendResponse,
  GymCoinRewardResponse,
  GymCoinRule,
  GymCoinTopUpResponse,
  GymCoinTransaction,
  GymCoinWallet,
} from "./gymcoin.types";

function getObjectValue(payload: unknown) {
  return payload && typeof payload === "object"
    ? (payload as Record<string, unknown>)
    : null;
}

function getNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function getBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeGymCoinWallet(payload: unknown): GymCoinWallet {
  const value = getObjectValue(payload);
  const nestedWallet = getObjectValue(value?.wallet);
  const source = nestedWallet ?? value;

  return {
    balance: getNumber(source?.balance),
    updatedAt: getString(source?.updatedAt),
  };
}

export function normalizeGymCoinTransactions(
  payload: unknown,
): GymCoinTransaction[] {
  const value = getObjectValue(payload);
  const rawList =
    (Array.isArray(value?.data) ? value?.data : null) ??
    (Array.isArray(value?.transactions) ? value?.transactions : null) ??
    (Array.isArray(payload) ? payload : null) ??
    [];

  return rawList.map((item, index) => {
    const transaction = getObjectValue(item);
    const type = getString(transaction?.type) ?? "unknown";
    const title =
      getString(transaction?.title) ??
      getString(transaction?.message) ??
      getString(transaction?.feature) ??
      type;
    const description =
      getString(transaction?.description) ?? getString(transaction?.message);
    const amount = normalizeTransactionAmount(getNumber(transaction?.amount), {
      type,
      title,
      description,
      feature: getString(transaction?.feature),
    });
    const idValue = transaction?.id;
    const id =
      typeof idValue === "number" || typeof idValue === "string"
        ? String(idValue)
        : `${type}-${index}`;

    return {
      id,
      amount,
      type,
      title,
      description,
      createdAt:
        getString(transaction?.createdAt) ??
        getString(transaction?.date) ??
        getString(transaction?.timestamp),
    };
  });
}

export function normalizeGymCoinAccessCheck(
  payload: unknown,
  feature: string,
): GymCoinAccessCheck {
  const value = getObjectValue(payload);

  const requiredCoins = getNumber(value?.requiredCoins);
  const currentBalance = getNumber(value?.currentBalance);
  const missingCoins =
    typeof value?.missingCoins === "number"
      ? getNumber(value.missingCoins)
      : Math.max(requiredCoins - currentBalance, 0);

  return {
    allowed: getBoolean(value?.allowed),
    feature,
    requiredCoins,
    currentBalance,
    missingCoins,
    message: getString(value?.message),
  };
}

export function normalizeGymCoinRewardResponse(
  payload: unknown,
): GymCoinRewardResponse {
  const value = getObjectValue(payload);
  const reasonKey = getRewardReasonKey(value);
  const title = getRewardTitle(value);

  return {
    rewarded: getBoolean(value?.rewarded),
    amount: getNumber(value?.amount),
    message: getString(value?.message),
    reasonKey,
    title,
    wallet: value ? normalizeGymCoinWallet(value) : null,
  };
}

export function normalizeGymCoinRules(payload: unknown): GymCoinRule[] {
  const value = getObjectValue(payload);
  const rawList =
    (Array.isArray(value?.data) ? value?.data : null) ??
    (Array.isArray(value?.rules) ? value?.rules : null) ??
    (Array.isArray(payload) ? payload : null) ??
    [];

  return rawList
    .map((item) => {
      const rule = getObjectValue(item);
      const feature = getString(rule?.feature);

      if (!feature) {
        return null;
      }

      return {
        feature,
        cost:
          typeof rule?.cost === "number"
            ? getNumber(rule.cost)
            : getNumber(rule?.requiredCoins),
        enabled:
          typeof rule?.enabled === "boolean"
            ? rule.enabled
            : getBoolean(rule?.isEnabled, true),
        updatedAt: getString(rule?.updatedAt),
      };
    })
    .filter((rule): rule is GymCoinRule => rule !== null);
}

export function normalizeGymCoinTopUpResponse(
  payload: unknown,
): GymCoinTopUpResponse {
  const value = getObjectValue(payload);

  return {
    message: getString(value?.message),
    wallet: value ? normalizeGymCoinWallet(value) : null,
  };
}

export function normalizeGymCoinFeatureSpendResponse(
  payload: unknown,
): GymCoinFeatureSpendResponse {
  const value = getObjectValue(payload);

  return {
    message: getString(value?.message),
    wallet: value ? normalizeGymCoinWallet(value) : null,
  };
}

function getRewardReasonKey(value: Record<string, unknown> | null) {
  if (!value) {
    return null;
  }

  const candidates = [
    value.reasonKey,
    value.rewardType,
    value.transactionType,
    value.feature,
    value.event,
    value.type,
    value.title,
  ];

  for (const candidate of candidates) {
    const normalized = getString(candidate);

    if (normalized && /^[a-z0-9_]+$/i.test(normalized)) {
      return normalized;
    }
  }

  return null;
}

function getRewardTitle(value: Record<string, unknown> | null) {
  if (!value) {
    return null;
  }

  return getString(value.title) ?? getString(value.reason);
}

function normalizeTransactionAmount(
  amount: number,
  context: {
    type: string;
    title: string;
    description: string | null;
    feature: string | null;
  },
) {
  if (amount === 0) {
    return 0;
  }

  if (amount < 0) {
    return amount;
  }

  const normalizedKeys = [
    context.type,
    context.title,
    context.description,
    context.feature,
  ]
    .map(normalizeTransactionKey)
    .filter(Boolean);

  if (normalizedKeys.some(isSpendTransactionKey)) {
    return -Math.abs(amount);
  }

  return amount;
}

function normalizeTransactionKey(value: string | null) {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function isSpendTransactionKey(value: string) {
  const spendKeys = new Set([
    "access_payment",
    "spend_feature",
    "feature_purchase",
    "payment",
    "purchase",
    "debit",
    "deduction",
    "withdrawal",
    "charge",
    "create_training_plan",
    "create_workout_day",
    "create_exercise",
  ]);

  if (spendKeys.has(value)) {
    return true;
  }

  return value.includes("spend") || value.includes("payment");
}
