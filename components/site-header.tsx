"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import type { Category } from "@/lib/category";
import { storeNavLinks } from "@/lib/category";
import { useStore } from "./store-provider";
import { CartDrawer } from "./cart-drawer";

export function SiteHeader({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { favorites, cart } = useStore();
  const links = storeNavLinks(categories);
  return <>
    <div className="topbar">⚽ Camisetas de fútbol <span>•</span> 📍 La Pampa <span>•</span> Consultas por WhatsApp e Instagram</div>
    <header className="site-header">
      <div className="container nav-row">
        <button className="mobile-toggle" onClick={() => setOpen(true)} aria-label="Abrir menú"><Menu /></button>
        <Link className="brand" href="/"><Image src="/logo.png" width={54} height={54} alt="Importando Fútbol LP" priority/><strong>IMPORTANDO<br/>FÚTBOL LP</strong></Link>
        <nav className="desktop-nav" aria-label="Principal">{links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
        <div className="nav-actions"><Link href="/camisetas" aria-label="Buscar"><Search /></Link><button aria-label={`${favorites.length} favoritos`}><Heart/><b>{favorites.length}</b></button><button onClick={() => setCartOpen(true)} aria-label={`${cart.length} productos en el carrito`}><ShoppingBag/><b>{cart.reduce((total,item) => total + (item.quantity ?? 1),0)}</b></button></div>
      </div>
    </header>
    {open && <div className="menu-backdrop" onClick={() => setOpen(false)}><aside className="mobile-menu" onClick={(e) => e.stopPropagation()}><button onClick={() => setOpen(false)} aria-label="Cerrar menú"><X/></button><div className="brand"><Image src="/logo.png" width={58} height={58} alt=""/><strong>IMPORTANDO FÚTBOL LP</strong></div><nav>{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</nav></aside></div>}
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}/>
  </>;
}
