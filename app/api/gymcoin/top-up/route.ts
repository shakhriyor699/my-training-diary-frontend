import { NextResponse } from "next/server";

import { createUnauthorizedResponse, forwardGymCoinRequest, getGymCoinAccessToken } from "../_lib/forward";

export async function POST(request: Request) {
  const accessToken = await getGymCoinAccessToken();

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  const json = await request.json().catch(() => null);
  const userId =
    json &&
    typeof json === "object" &&
    "userId" in json &&
    typeof json.userId === "number"
      ? json.userId
      : null;
  const amount =
    json &&
    typeof json === "object" &&
    "amount" in json &&
    typeof json.amount === "number"
      ? json.amount
      : null;
  const reason =
    json &&
    typeof json === "object" &&
    "reason" in json &&
    typeof json.reason === "string"
      ? json.reason
      : undefined;

  if (userId === null || amount === null) {
    return NextResponse.json(
      { message: "userId and amount are required." },
      { status: 400 },
    );
  }

  return forwardGymCoinRequest("/gymcoin/top-up", {
    method: "POST",
    body: JSON.stringify({
      userId,
      amount,
      ...(reason ? { reason } : {}),
    }),
    accessToken,
  });
}
