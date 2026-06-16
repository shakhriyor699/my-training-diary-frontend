import { createUnauthorizedResponse, forwardGymCoinRequest, getGymCoinAccessToken } from "../_lib/forward";

export async function POST() {
  const accessToken = await getGymCoinAccessToken();

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  return forwardGymCoinRequest("/gymcoin/daily-login", {
    method: "POST",
    accessToken,
  });
}
