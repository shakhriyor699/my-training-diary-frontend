import { NextResponse } from "next/server";

import { createUnauthorizedResponse, forwardGymCoinRequest, getGymCoinAccessToken } from "../../_lib/forward";

type RouteContext = {
  params: Promise<{ feature: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const accessToken = await getGymCoinAccessToken();

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  const { feature } = await context.params;
  const json = await request.json().catch(() => null);
  const cost =
    json && typeof json === "object" && "cost" in json && typeof json.cost === "number"
      ? json.cost
      : null;
  const enabled =
    json &&
    typeof json === "object" &&
    "enabled" in json &&
    typeof json.enabled === "boolean"
      ? json.enabled
      : null;

  if (!feature || cost === null || enabled === null) {
    return NextResponse.json(
      { message: "Feature, cost and enabled are required." },
      { status: 400 },
    );
  }

  return forwardGymCoinRequest(`/gymcoin/rules/${feature}`, {
    method: "PATCH",
    body: JSON.stringify({ cost, enabled }),
    accessToken,
  });
}
