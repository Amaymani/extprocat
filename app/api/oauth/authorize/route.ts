// app/api/oauth/authorize/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.ZOHO_CLIENT_ID!;
  const redirectUri = process.env.ZOHO_REDIRECT_URI!;
  const scope = "ZohoCreator.report.READ,ZohoCreator.form.CREATE,ZohoCreator.meta.READ";
  const accountsBase = process.env.ZOHO_ACCOUNTS_BASE || "https://accounts.zoho.com.au";

  const url = `${accountsBase}/oauth/v2/auth?scope=${encodeURIComponent(scope)}&client_id=${clientId}&response_type=code&access_type=offline&prompt=consent&redirect_uri=${encodeURIComponent(redirectUri)}`;
  return NextResponse.redirect(url);
}
