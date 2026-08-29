import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import products from "@/data/products.json";

const categories = [{ name: "Selecciones", href: "/selecciones", number: "01" }, { name: "Clubes", href: "/clubes", number: "02" }, { name: "Retro", href: "/retro", number: "03" }, { name: "Novedades", href: "/camisetas", number: "04" }];

export default function HomePage() {
  return <>
    <section className="hero"><div className="container hero-grid"><div><span className="eyebrow">TU PASIÓN. TU CAMISETA.</span><h1>FÚTBOL<br/>QUE SE <em>VISTE.</em></h1><p>Descubrí camisetas de clubes y selecciones, encontrá tu talle y consultá tu pedido sin vueltas.</p><div className="hero-actions"><Link className="button gold" href="/camisetas">Ver camisetas <ArrowRight/></Link><Link className="button outline" href="/retro">Explorar retro</Link></div></div><div className="hero-art"><div className="gold-orbit"/><Image src="/logo.png" width={410} height={410} alt="Logo Importando Fútbol LP" priority/><span className="floating-label first">NUEVOS INGRESOS</span><span className="floating-label second">LA PAMPA · ARGENTINA</span></div></div></section>
    <section className="section container"><header className="section-heading"><div><span className="eyebrow dark">EXPLORÁ</span><h2>Encontrá tu camiseta</h2></div><p>Categorías simples para llegar más rápido a la que buscás.</p></header><div className="category-grid">{categories.map((cat) => <Link className="category-card" key={cat.name} href={cat.href}><small>{cat.number}</small><strong>{cat.name}</strong><ArrowRight/></Link>)}</div></section>
    <section className="section container compact"><header className="section-heading"><div><span className="eyebrow dark">DESTACADAS</span><h2>Las más buscadas</h2></div><Link className="text-link" href="/camisetas">Ver todas <ArrowRight/></Link></header><div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product}/>)}</div></section>
    <section className="section container compact"><div className="request-banner"><div><span className="eyebrow">¿NO LA ENCONTRÁS?</span><h2>Buscamos esa camiseta por vos.</h2><p>Contanos el equipo, temporada, talle y versión que necesitás.</p></div><Link href="/contacto" className="button dark-button">Hacer una consulta <ArrowRight/></Link></div></section>
    <section className="section container benefits"><div><ShieldCheck/><strong>Compra simple</strong><span>Contacto directo para cerrar tu pedido.</span></div><div><Ruler/><strong>Guía de talles</strong><span>Elegí tu medida con más seguridad.</span></div><div><Sparkles/><strong>Novedades primero</strong><span>Encontrá los últimos ingresos.</span></div></section>
  </>;
}
