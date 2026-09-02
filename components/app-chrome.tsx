"use client";

import { usePathname } from "next/navigation";
import type { Category } from "@/lib/category";
import type { ContactChannel } from "@/lib/contacts";
import { storeWhatsAppFromContacts } from "@/lib/contacts";
import { FlowSyncCredit, SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { WhatsAppCTA } from "./whatsapp-cta";

export function AppChrome({ children, categories, contacts }: { children: React.ReactNode; categories: Category[]; contacts: ContactChannel[] }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <div className="admin-wrap"><main>{children}</main><p className="admin-credit"><FlowSyncCredit/></p></div>;
  return <><SiteHeader categories={categories}/><main>{children}</main><SiteFooter contacts={contacts}/><WhatsAppCTA storePhone={storeWhatsAppFromContacts(contacts)}/></>;
}
