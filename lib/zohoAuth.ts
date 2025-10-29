import axios from "axios";
import { dbConnect } from "@/lib/dbConnect";
import ZohoToken from "@/models/ZohoToken";

export async function getValidAccessToken() {
  await dbConnect();
  const tokenDoc = await ZohoToken.findOne();

  if (!tokenDoc) throw new Error("No Zoho tokens found — please authorize again");

  if (Date.now() < tokenDoc.expires_at - 60_000) {
    return tokenDoc.access_token;
  }

  console.log("🔁 Refreshing expired access token...");

  const clientId = process.env.ZOHO_CLIENT_ID!;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET!;
  const accountsBase = process.env.ZOHO_ACCOUNTS_BASE || "https://accounts.zoho.com.au";

  const res = await axios.post(`${accountsBase}/oauth/v2/token`, null, {
    params: {
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: tokenDoc.refresh_token,
    },
  });

  const data = res.data;
  tokenDoc.access_token = data.access_token;
  tokenDoc.expires_at = Date.now() + data.expires_in * 1000;
  await tokenDoc.save();

  console.log("✅ Token refreshed and updated in DB");

  return data.access_token;
}
