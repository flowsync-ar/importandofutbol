import type { Metadata } from "next";
import "./globals.css";
import { AppChrome } from "@/components/app-chrome";
import { StoreProvider } from "@/components/store-provider";
import { getCategories } from "@/lib/categories";

export const metadata: Metadata = { title: { default: "Importando Fútbol LP", template: "%s | Importando Fútbol LP" }, description: "Camisetas de fútbol de clubes, selecciones y modelos retro." };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  return <html lang="es"><body><StoreProvider><AppChrome categories={categories}>{children}</AppChrome></StoreProvider></body></html>;
}
