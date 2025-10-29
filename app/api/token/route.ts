// app/api/token/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { getTokenStore } from "../oauth/callback/route";

const accountsBase = process.env.ZOHO_ACCOUNTS_BASE || "https://accounts.zoho.com.au";

async function refreshIfNeeded(store: any) {
  if (!store.refresh_token) return store;
  if (store.expires_at && Date.now() < store.expires_at - 60_000) {
    return store; // still valid
  }
  const clientId = process.env.ZOHO_CLIENT_ID!;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET!;
  try {
    const res = await axios.post(`${accountsBase}/oauth/v2/token`, null, {
      params: {
        grant_type: "refresh_token",
        refresh_token: store.refresh_token,
        client_id: clientId,
        client_secret: clientSecret,
      },
    });
    store.access_token = res.data.access_token;
    store.expires_at = Date.now() + res.data.expires_in * 1000;
    return store;
  } catch (err) {
    console.error("refresh failed", err);
    return store;
  }
}

export async function GET() {
  const store = getTokenStore();
  if (!store.access_token) return new NextResponse("Not authorized", { status: 401 });
  await refreshIfNeeded(store);
  return NextResponse.json({ access_token: store.access_token });
}
