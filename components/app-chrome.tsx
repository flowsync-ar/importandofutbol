"use client";

import { usePathname } from "next/navigation";
import type { Category } from "@/lib/category";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { WhatsAppCTA } from "./whatsapp-cta";

export function AppChrome({ children, categories }: { children: React.ReactNode; categories: Category[] }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <main>{children}</main>;
  return <><SiteHeader categories={categories}/><main>{children}</main><SiteFooter categories={categories}/><WhatsAppCTA/></>;
}
