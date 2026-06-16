import { createUnauthorizedResponse, forwardGymCoinRequest, getGymCoinAccessToken } from "../_lib/forward";

export async function GET() {
  const accessToken = await getGymCoinAccessToken();

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  return forwardGymCoinRequest("/gymcoin/wallet", {
    method: "GET",
    accessToken,
  });
}
