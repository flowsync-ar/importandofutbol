import Link from "next/link";
import { ArrowRight, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import { AdSpot } from "@/components/ad-spot";
import { HeroFeatured } from "@/components/hero-featured";
import { ProductCard } from "@/components/product-card";
import { adBySlot, isVisibleAd } from "@/lib/ads";
import { getAds, getCategories, getStoreProducts } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, products, ads] = await Promise.all([getCategories(), getStoreProducts(), getAds()]);
  const cards = [
    ...categories.map((category, index) => ({ name: category.name, href: `/${category.slug}`, number: String(index + 1).padStart(2, "0") })),
    { name: "Novedades", href: "/camisetas", number: String(categories.length + 1).padStart(2, "0") },
  ];
  const retro = categories.find((category) => category.slug === "retro");
  return <>
    <section className="hero"><div className="container hero-grid"><div><span className="eyebrow">TU PASIÓN. TU CAMISETA.</span><h1>FÚTBOL<br/>QUE SE <em>VISTE.</em></h1><p>Descubrí las mas lindas camisetas y consultá tu pedido sin vueltas.</p><div className="hero-actions"><Link className="button gold" href="/camisetas">Ver camisetas <ArrowRight/></Link><Link className="button outline" href={retro ? `/${retro.slug}` : "/camisetas"}>Explorar retro</Link></div></div><HeroFeatured products={products}/></div></section>
    <section className="section container"><header className="section-heading"><div><span className="eyebrow dark">EXPLORÁ</span><h2>Encontrá tu camiseta</h2></div><p>Categorías simples para llegar más rápido a la que buscás.</p></header><div className="category-grid">{cards.map((cat) => <Link className="category-card" key={cat.href} href={cat.href}><small>{cat.number}</small><strong>{cat.name}</strong><ArrowRight/></Link>)}</div></section>
    {isVisibleAd(adBySlot(ads, "home")) ? <section className="section container compact"><AdSpot ad={adBySlot(ads, "home")}/></section> : null}
    <section className="section container compact"><header className="section-heading"><div><span className="eyebrow dark">DESTACADAS</span><h2>Las más buscadas</h2></div><Link className="text-link" href="/camisetas">Ver todas <ArrowRight/></Link></header><div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product}/>)}</div></section>
    <section className="section container compact"><div className="request-banner"><div><span className="eyebrow">¿NO LA ENCONTRÁS?</span><h2>Buscamos esa camiseta por vos.</h2><p>Contanos el equipo, temporada, talle y versión que necesitás.</p></div><Link href="/contacto" className="button dark-button">Hacer una consulta <ArrowRight/></Link></div></section>
    <section className="section container benefits"><div><ShieldCheck/><strong>Compra simple</strong><span>Contacto directo para cerrar tu pedido.</span></div><div><Ruler/><strong>Guía de talles</strong><span>Elegí tu medida con más seguridad.</span></div><div><Sparkles/><strong>Novedades primero</strong><span>Encontrá los últimos ingresos.</span></div></section>
  </>;
}
