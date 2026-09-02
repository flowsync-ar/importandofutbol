import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { supabasePublicEnv } from "@/lib/supabase/env";
import { STORE_WHATSAPP, whatsappHref } from "@/lib/customer";

export type ContactChannel = {
  id: string;
  name: string;
  value: string;
  button_label: string;
  href: string | null;
  sort_order: number;
};

export const DEFAULT_CONTACTS: ContactChannel[] = [
  { id: "wa", name: "WhatsApp", value: STORE_WHATSAPP, button_label: "Escribir por WhatsApp", href: null, sort_order: 1 },
  { id: "ig", name: "Instagram", value: "@Importandofutbol.lp", button_label: "Abrir Instagram", href: "https://instagram.com/Importandofutbol.lp", sort_order: 2 },
];

export function isWhatsAppContact(channel: Pick<ContactChannel, "name">) {
  return /whatsapp/i.test(channel.name);
}

export function contactHref(channel: Pick<ContactChannel, "name" | "value" | "href">) {
  const explicit = channel.href?.trim();
  if (explicit) return explicit;
  const value = channel.value.trim();
  if (/^https?:\/\//i.test(value)) return value;
  const handle = value.replace(/^@/, "");
  const key = channel.name.toLowerCase();
  if (key.includes("tiktok")) return `https://www.tiktok.com/@${handle}`;
  if (key.includes("instagram")) return `https://instagram.com/${handle}`;
  if (key.includes("facebook")) return `https://facebook.com/${handle}`;
  const chat = whatsappHref(value);
  if (key.includes("whatsapp") || chat) return chat ?? value;
  return value;
}

export function storeWhatsAppFromContacts(channels: ContactChannel[]) {
  return channels.find((channel) => isWhatsAppContact(channel))?.value ?? STORE_WHATSAPP;
}

export const getContactChannels = cache(async (): Promise<ContactChannel[]> => {
  if (!supabasePublicEnv()) return DEFAULT_CONTACTS;
  const supabase = await createClient();
  const { data, error } = await supabase.from("contact_channels").select("id,name,value,button_label,href,sort_order").order("sort_order").order("name");
  if (error || !data?.length) return DEFAULT_CONTACTS;
  return data as ContactChannel[];
});
