export type Customer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
};

export function blankToNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export const STORE_WHATSAPP = "+54 9 2954 82-7189";

export function storeWhatsAppHref(text: string) {
  return `${whatsappHref(STORE_WHATSAPP)}?text=${encodeURIComponent(text)}`;
}
