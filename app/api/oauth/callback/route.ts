import { NextResponse } from "next/server";
import axios from "axios";
import { dbConnect } from "@/lib/dbConnect";
import ZohoToken from "@/models/ZohoToken";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return new NextResponse("Missing code", { status: 400 });

  const clientId = process.env.ZOHO_CLIENT_ID!;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET!;
  const redirectUri = process.env.ZOHO_REDIRECT_URI!;
  const accountsBase = process.env.ZOHO_ACCOUNTS_BASE || "https://accounts.zoho.com.au";

  try {
    const tokenRes = await axios.post(`${accountsBase}/oauth/v2/token`, null, {
      params: {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      },
    });

    const data = tokenRes.data;
    const expiresAt = Date.now() + data.expires_in * 1000;

    await dbConnect();

    // Clear old tokens and save new one (since only one app instance)
    await ZohoToken.deleteMany({});
    await ZohoToken.create({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: expiresAt,
    });

    console.log("✅ Tokens saved to DB");

    return new NextResponse(`<h3>Authorized successfully! You can close this tab.</h3>`, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (err: any) {
    console.error("Token exchange failed", err.response?.data || err.message);
    return new NextResponse("Failed to obtain token", { status: 500 });
  }
}
