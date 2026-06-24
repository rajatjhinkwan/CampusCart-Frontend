/** Safe display helpers — prevent React crashes when API returns objects */

export function formatCategory(category) {
  if (!category) return "Uncategorized";
  if (typeof category === "string") return category;
  if (typeof category === "object") {
    return category.title || category.name || category.label || "Uncategorized";
  }
  return String(category);
}

export function formatLocation(location) {
  if (!location) return "Location not set";
  if (typeof location === "string") {
    const s = location.trim();
    if (s.startsWith("{") && s.endsWith("}")) {
      try {
        return formatLocation(JSON.parse(s));
      } catch {
        return s || "Location not set";
      }
    }
    return s || "Location not set";
  }
  if (typeof location === "object") {
    const { address, area, city, state, pincode } = location;
    const str = [address, area, city, state, pincode].filter(Boolean).join(", ");
    return str || "Location not set";
  }
  return "Location not set";
}

export function resolveMediaUrl(url, baseUrl = "") {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  const base = baseUrl || "";
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

export function formatSeller(seller, fallback = "Seller") {
  if (!seller) return fallback;
  if (typeof seller === "string") return seller;
  if (typeof seller === "object") {
    return seller.name || seller.email || fallback;
  }
  return String(seller);
}
