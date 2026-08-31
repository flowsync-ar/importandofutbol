import Image from "next/image";
import Link from "next/link";
import { AtSign } from "lucide-react";
import type { Category } from "@/lib/category";
import { storeShopLinks } from "@/lib/category";

export function FlowSyncCredit() {
  return <a className="flowsync-credit" href="https://www.flowsync.com.ar" target="_blank" rel="noopener noreferrer">Desarrollado por FlowSync</a>;
}

export function SiteFooter({ categories }: { categories: Category[] }) {
  return <footer><div className="container footer-grid"><div><div className="brand"><Image src="/logo.png" width={58} height={58} alt=""/><strong>IMPORTANDO FÚTBOL LP</strong></div><p>Tu pasión, tu camiseta. Clubes, selecciones y modelos retro.</p></div><div><strong>Comprar</strong>{storeShopLinks(categories).map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</div><div><strong>Ayuda</strong><Link href="/guia-de-talles">Guía de talles</Link><Link href="/contacto">Contacto</Link><a href="https://instagram.com/Importandofutbol.lp" target="_blank" rel="noopener noreferrer"><AtSign size={14}/> @Importandofutbol.lp</a></div></div><div className="container copyright"><span>© {new Date().getFullYear()} Importando Fútbol LP</span><FlowSyncCredit/></div></footer>;
}
