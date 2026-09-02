import type { Metadata } from "next";
import "./globals.css";
import { AppChrome } from "@/components/app-chrome";
import { StoreProvider } from "@/components/store-provider";
import { getCategories, getContactChannels } from "@/lib/categories";
import { storeWhatsAppFromContacts } from "@/lib/contacts";

export const metadata: Metadata = { title: { default: "Importando Fútbol LP", template: "%s | Importando Fútbol LP" }, description: "Camisetas de fútbol de clubes, selecciones y modelos retro." };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, contacts] = await Promise.all([getCategories(), getContactChannels()]);
  return <html lang="es"><body><StoreProvider storePhone={storeWhatsAppFromContacts(contacts)}><AppChrome categories={categories} contacts={contacts}>{children}</AppChrome></StoreProvider></body></html>;
}
