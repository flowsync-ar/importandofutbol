"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import type { Category } from "@/lib/category";
import { storeCategoryLinks } from "@/lib/category";
import { useStore } from "./store-provider";
import { CartDrawer } from "./cart-drawer";

export function SiteHeader({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const { favorites, cart } = useStore();
  const categoryLinks = storeCategoryLinks(categories);
  return <>
    <div className="topbar"> Camisetas de calidad premium <span>•</span> 📍 de La Pampa al mundo <span>•</span> Consultas por WhatsApp e Instagram en nuestro contacto </div>
    <header className="site-header">
      <div className="container nav-row">
        <button className="mobile-toggle" onClick={() => setOpen(true)} aria-label="Abrir menú"><Menu /></button>
        <Link className="brand" href="/"><Image src="/logo.png" width={124} height={124} alt="Importando Fútbol LP" priority/></Link>
        <nav className="desktop-nav" aria-label="Principal">
          <Link href="/">Inicio</Link>
          <Link href="/camisetas">Camisetas</Link>
          <div className={`nav-drop${catsOpen ? " open" : ""}`}>
            <button type="button" aria-expanded={catsOpen} onClick={() => setCatsOpen((value) => !value)}>Categorías <ChevronDown/></button>
            <div className="nav-drop-menu">{categoryLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setCatsOpen(false)}>{link.label}</Link>)}</div>
          </div>
          <Link href="/contacto">Contacto</Link>
        </nav>
        <div className="nav-actions"><Link href="/camisetas" aria-label="Buscar"><Search /></Link><button aria-label={`${favorites.length} favoritos`}><Heart/><b>{favorites.length}</b></button><button onClick={() => setCartOpen(true)} aria-label={`${cart.length} productos en el carrito`}><ShoppingBag/><b>{cart.reduce((total,item) => total + (item.quantity ?? 1),0)}</b></button></div>
      </div>
    </header>
    {open && <div className="menu-backdrop" onClick={() => setOpen(false)}><aside className="mobile-menu" onClick={(e) => e.stopPropagation()}><button onClick={() => setOpen(false)} aria-label="Cerrar menú"><X/></button><Link className="brand" href="/" onClick={() => setOpen(false)}><Image src="/logo.png" width={88} height={88} alt="Importando Fútbol LP"/></Link><nav><Link href="/" onClick={() => setOpen(false)}>Inicio</Link><Link href="/camisetas" onClick={() => setOpen(false)}>Camisetas</Link><strong className="mobile-cats">Categorías</strong>{categoryLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}<Link href="/contacto" onClick={() => setOpen(false)}>Contacto</Link></nav></aside></div>}
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}/>
  </>;
}
