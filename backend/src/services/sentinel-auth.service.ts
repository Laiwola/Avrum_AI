import axios from "axios";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getSentinelAccessToken(): Promise<string> {
  const now = Date.now();

  // Reuse token if it is still valid.
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const clientId = process.env.COPERNICUS_CLIENT_ID;
  const clientSecret = process.env.COPERNICUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Copernicus credentials are not configured."
    );
  }

  const body = new URLSearchParams();

  body.append("grant_type", "client_credentials");
  body.append("client_id", clientId);
  body.append("client_secret", clientSecret);

  const response = await axios.post<TokenResponse>(
    process.env.COPERNICUS_TOKEN_URL!,
    body.toString(),
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
    }
  );

  cachedToken = response.data.access_token;

  // Refresh slightly before actual expiry.
  tokenExpiresAt =
    now + (response.data.expires_in - 60) * 1000;

  return cachedToken;
}