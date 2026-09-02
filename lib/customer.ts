export type Customer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
};

const LEAD_KEY = "iflp-lead";

export function blankToNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export const STORE_WHATSAPP = "+54 9 2954 82-7189";

export function storeWhatsAppHref(text: string, phone = STORE_WHATSAPP) {
  return `${whatsappHref(phone)}?text=${encodeURIComponent(text)}`;
}

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

export function consultMessage(name: string, body: string) {
  return `Hola, soy ${name.trim()}.\n${body}`;
}

export function readStoredLead() {
  if (typeof window === "undefined") return null;
  try {
    const lead = JSON.parse(localStorage.getItem(LEAD_KEY) ?? "") as { name?: string; phone?: string };
    const phone = normalizePhone(lead.phone ?? "");
    const name = lead.name?.trim() ?? "";
    return name && phone ? { name, phone } : null;
  } catch {
    return null;
  }
}

export function writeStoredLead(name: string, phone: string) {
  localStorage.setItem(LEAD_KEY, JSON.stringify({ name, phone }));
}

export type ConsultLead = { name: string; phone: string; notes: string };

export function consultLeadPayload(name: string, phone: string, notes: string): ConsultLead | null {
  const trimmedName = name.trim().slice(0, 80);
  const digits = normalizePhone(phone);
  if (trimmedName.length < 2 || !digits) return null;
  return { name: trimmedName, phone: digits, notes: notes.trim().slice(0, 500) };
}
