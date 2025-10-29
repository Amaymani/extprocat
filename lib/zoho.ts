// lib/zoho.ts
export const APP_NAME = "product-catalog";
export const REPORT_NAME = "Product_Details";
export const FORM_NAME = "Add_to_wishlist";
export const OWNER_NAME = "dskdemo";

export function parseZohoImage(imageObj?: any) {
  if (!imageObj) return "/placeholder.png";

  // Extract raw string value
  const value =
    typeof imageObj === "string"
      ? imageObj
      : imageObj.Product_Image || imageObj.zc_display_value;

  if (!value) return "/placeholder.png";

  // 🧩 Case 1: Embedded <img src="...">
  const match = value.match(/src\s*=\s*"([^"]+)"/);
  if (match) return match[1];

  // 🧩 Case 2: Starts with /api — use proxy directly
  if (value.startsWith("/api/v2.1/")) {
    // Ensure full Zoho Creator format (no missing parts)
    return `/api/proxy?path=${encodeURIComponent(value)}`;
  }

  // 🧩 Case 3: If Zoho gave shortened `/api/v2/` instead of `/api/v2.1/`
  if (value.startsWith("/api/v2/")) {
    const fixed = value.replace("/api/v2/", "/api/v2.1/");
    return `/api/proxy?path=${encodeURIComponent(fixed)}`;
  }

  // 🧩 Case 4: Relative image file path (like “17617xxxx.jpeg”)
  if (/\.(png|jpg|jpeg)$/i.test(value)) {
    return `/api/proxy?path=/api/v2.1/${OWNER_NAME}/${APP_NAME}/report/${REPORT_NAME}/download?filepath=${encodeURIComponent(
      value
    )}`;
  }

  return "/placeholder.png";
}
