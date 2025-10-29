import { NextRequest, NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/zohoAuth";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
    }

    // Get valid Zoho OAuth token from DB or refresh if needed
    const token = await getValidAccessToken();

    // Build Zoho Creator full URL
    const zohoUrl = path.startsWith("http")
      ? path
      : `https://creator.zoho.com.au${path.startsWith("/") ? "" : "/"}${path}`;

    // Forward request to Zoho
    const res = await fetch(zohoUrl, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Zoho API error:", res.status, zohoUrl);
      return NextResponse.json(
        { error: `Zoho API error: ${res.status}`, details: await res.text() },
        { status: res.status }
      );
    }

    // Handle binary (images/files) or JSON
    const contentType = res.headers.get("content-type") || "";
    const isBinary = !contentType.includes("application/json");
    const data = isBinary ? await res.arrayBuffer() : await res.json();

    return new NextResponse(isBinary ? data : JSON.stringify(data), {
      status: res.status,
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
