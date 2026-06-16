import { NextResponse } from "next/server";

import { createUnauthorizedResponse, forwardGymCoinRequest, getGymCoinAccessToken } from "../_lib/forward";

type RouteContext = {
  request: Request;
};

export async function GET(request: RouteContext["request"]) {
  const accessToken = await getGymCoinAccessToken();

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "1";
  const limit = url.searchParams.get("limit") ?? "10";

  if (!/^\d+$/.test(page) || !/^\d+$/.test(limit)) {
    return NextResponse.json({ message: "Invalid pagination params." }, { status: 400 });
  }

  return forwardGymCoinRequest(`/gymcoin/transactions?page=${page}&limit=${limit}`, {
    method: "GET",
    accessToken,
  });
}
