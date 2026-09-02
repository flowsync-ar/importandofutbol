export type AdSlot = "home" | "catalog";

export type Ad = {
  id: string;
  slot: AdSlot;
  title: string;
  description: string;
  href: string;
  image_url: string | null;
  active: boolean;
};

export const AD_SLOTS: { id: AdSlot; label: string; hint: string }[] = [
  { id: "home", label: "Inicio", hint: "Entre las categorías y las camisetas." },
  { id: "catalog", label: "Catálogo", hint: "Arriba de la grilla de camisetas." },
];

export function adHref(href: string) {
  const trimmed = href.trim();
  if (!trimmed || /^(javascript|data):/i.test(trimmed)) return null;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) return trimmed;
  return `https://${trimmed}`;
}

export function isVisibleAd(ad: Ad | null | undefined): ad is Ad {
  return Boolean(ad?.active && ad.image_url && adHref(ad.href));
}

export function emptyAd(slot: AdSlot): Ad {
  return { id: slot, slot, title: "", description: "", href: "", image_url: null, active: false };
}

export function adBySlot(ads: Ad[], slot: AdSlot) {
  return ads.find((ad) => ad.slot === slot) ?? emptyAd(slot);
}

export function adTextParts(text: string) {
  const parts: { bold: boolean; text: string }[] = [];
  const marks = /\*\*([^*]+)\*\*/g;
  let last = 0;
  for (const match of text.matchAll(marks)) {
    if (match.index > last) parts.push({ bold: false, text: text.slice(last, match.index) });
    parts.push({ bold: true, text: match[1] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ bold: false, text: text.slice(last) });
  return parts;
}
