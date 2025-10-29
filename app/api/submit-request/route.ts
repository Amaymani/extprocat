import { NextRequest, NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/zohoAuth";
import { OWNER_NAME, APP_NAME, REPORT_NAME, FORM_NAME } from "@/lib/zoho";

export async function POST(req: NextRequest) {
  try {
    const { selected, details, products } = await req.json();

    if (!selected?.length || !products?.length) {
      return NextResponse.json(
        { error: "Missing selected products or product data" },
        { status: 400 }
      );
    }

    const token = await getValidAccessToken();
    const baseUrl = `https://creator.zoho.com.au/api/v2/${OWNER_NAME}/${APP_NAME}/form/${FORM_NAME}`;

    // Send all requests in parallel for speed
    const results = await Promise.all(
      selected.map(async (name: string) => {
        const product = products.find((p: any) => p.Product_Name === name);
        if (!product) return { name, success: false, reason: "Product not found" };

        const payload = {
          data: {
            Email: details?.Email || "user1@demo14.thedsk.au",
            Product_Name: product.ID,
            ...details,
          },
        };

        try {
          const res = await fetch(baseUrl, {
            method: "POST",
            headers: {
              Authorization: `Zoho-oauthtoken ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          return { name, success: res.ok };
        } catch (err: any) {
          return { name, success: false, reason: err.message };
        }
      })
    );

    const completed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).map(r => r.name);

    return NextResponse.json({
      success: true,
      completed,
      failed,
      message:
        failed.length === 0
          ? "✅ All products added to Wishlist!"
          : `⚠️ Some items failed: ${failed.join(", ")}`,
    });
  } catch (err: any) {
    console.error("❌ Wishlist submission failed:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
