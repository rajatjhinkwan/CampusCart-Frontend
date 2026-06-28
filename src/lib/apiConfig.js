/**
 * Central API configuration for dev and production.
 * Production Vercel builds need a real backend URL when VITE_API_BASE_URL is unset.
 */
export const PRODUCTION_API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://campuscart-backend-34qc.onrender.com";

export function getApiBaseUrl() {
  if (import.meta.env.DEV) {
    // Empty string uses Vite dev proxy (/api -> backend)
    return import.meta.env.VITE_API_DEV_URL || "";
  }
  return PRODUCTION_API_URL;
}

/** Normalize avatar from string or legacy object shapes */
export function resolveAvatarUrl(avatar) {
  if (!avatar) return null;
  if (typeof avatar === "string" && avatar.trim()) return avatar;
  if (typeof avatar === "object") {
    return avatar.url || avatar.secure_url || null;
  }
  return null;
}
