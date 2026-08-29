import type { Metadata } from "next";
import "./globals.css";
import { AppChrome } from "@/components/app-chrome";
import { StoreProvider } from "@/components/store-provider";

export const metadata: Metadata = { title: { default: "Importando Fútbol LP", template: "%s | Importando Fútbol LP" }, description: "Camisetas de fútbol de clubes, selecciones y modelos retro." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body><StoreProvider><AppChrome>{children}</AppChrome></StoreProvider></body></html>;
}
