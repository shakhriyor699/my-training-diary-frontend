import { NextResponse } from "next/server";

import { createUnauthorizedResponse, forwardGymCoinRequest, getGymCoinAccessToken } from "../_lib/forward";

export async function POST(request: Request) {
  const accessToken = await getGymCoinAccessToken();

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  const json = await request.json().catch(() => null);
  const feature =
    json &&
    typeof json === "object" &&
    "feature" in json &&
    typeof json.feature === "string"
      ? json.feature
      : null;

  if (!feature) {
    return NextResponse.json({ message: "Feature is required." }, { status: 400 });
  }

  return forwardGymCoinRequest("/gymcoin/spend-feature", {
    method: "POST",
    body: JSON.stringify({ feature }),
    accessToken,
  });
}
