"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { productPhotos } from "@/lib/product-images";
import { featuredProducts, type Product } from "@/lib/types";

export function HeroFeatured({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);
  const featured = featuredProducts(products);
  const slide = featured[index] ?? featured[0];
  const photo = slide ? productPhotos(slide)[0] : null;

  useEffect(() => {
    if (featured.length < 2) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % featured.length), 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (!slide) {
    return <div className="hero-art"><div className="gold-orbit"/><Image src="/logo.png" width={410} height={410} alt="Logo Importando Fútbol LP" priority/><span className="floating-label first">NUEVOS INGRESOS</span><span className="floating-label second">DE LA PAMPA AL MUNDO</span></div>;
  }

  return <div className="hero-art has-slide">
    <Link className="hero-slide" href={`/camisetas/${slide.slug}`} aria-label={`Ver ${slide.name}`}>
      {photo ? <img src={photo} alt={slide.name}/> : <Image src="/logo.png" width={410} height={410} alt={slide.name} priority/>}
      <span className="floating-label first">{slide.featured_title || slide.name}</span>
    </Link>
    {featured.length > 1 && <div className="hero-controls">
      <button type="button" aria-label="Anterior" onClick={() => setIndex((current) => (current - 1 + featured.length) % featured.length)}><ChevronLeft/></button>
      <div className="hero-dots">{featured.map((product, itemIndex) => <button type="button" key={product.id} className={itemIndex === index ? "active" : ""} aria-label={product.featured_title || product.name} onClick={() => setIndex(itemIndex)}/>)}</div>
      <button type="button" aria-label="Siguiente" onClick={() => setIndex((current) => (current + 1) % featured.length)}><ChevronRight/></button>
    </div>}
    <span className="floating-label second">DE LA PAMPA AL MUNDO</span>
  </div>;
}
