"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { WhatsAppCTA } from "./whatsapp-cta";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <main>{children}</main>;
  return <><SiteHeader/><main>{children}</main><SiteFooter/><WhatsAppCTA/></>;
}
