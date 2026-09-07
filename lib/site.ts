export function siteOrigin(fallback = "") {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || fallback;
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw.replace(/\/$/, "") : `https://${raw.replace(/\/$/, "")}`;
}

export function absoluteUrl(path: string, origin = siteOrigin()) {
  const value = path.trim();
  if (!value || !origin) return /^https?:\/\//i.test(value) ? value : "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${origin.replace(/\/$/, "")}${value.startsWith("/") ? value : `/${value}`}`;
}
