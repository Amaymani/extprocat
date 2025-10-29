import { NextResponse } from "next/server";
import axios from "axios";
import { getValidAccessToken } from "@/lib/zohoAuth";
import { OWNER_NAME, APP_NAME, REPORT_NAME } from "@/lib/zoho";

export async function GET() {
  try {
    console.log("Fetching products from Zoho...");
    const token = await getValidAccessToken();
    console.log("Using access token:", token);

    const ProRes = await axios.get(
      `https://www.zohoapis.com.au/creator/v2.1/data/${OWNER_NAME}/${APP_NAME}/report/${REPORT_NAME}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          Accept: "application/json",
        },
      }
    );

    return NextResponse.json(ProRes.data);
  } catch (err: any) {
    console.error("Zoho fetch error:", err.response?.data || err.message);
    return new NextResponse("Zoho API error", { status: 502 });
  }
}
