"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { productPhotos } from "@/lib/product-images";
import { useStore } from "./store-provider";

const jerseyClass: Record<string, string> = { Selecciones: "sky", Clubes: "club", Retro: "retro" };

export function ProductCard({ product }: { product: Product }) {
  const { favorites, toggleFavorite } = useStore();
  const favorite = favorites.includes(product.id);
  const photo = productPhotos(product)[0];
  return <article className="product-card">
    <div className="product-visual">
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <button className={`favorite ${favorite ? "active" : ""}`} onClick={() => toggleFavorite(product.id)} aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}><Heart fill={favorite ? "currentColor" : "none"}/></button>
      <Link href={`/camisetas/${product.slug}`} aria-label={`Ver ${product.name}`}>{photo ? <img className="product-photo" src={photo} alt={product.name}/> : <span className={`jersey ${jerseyClass[product.category] ?? ""}`}/>}</Link>
    </div>
    <div className="product-info"><span>{product.category}</span><Link href={`/camisetas/${product.slug}`}><h3>{product.name}</h3></Link><strong>{product.price ? `$ ${product.price.toLocaleString("es-AR")}` : "Consultar precio"}</strong><div className="size-list">{product.sizes.map((size) => <small key={size}>{size}</small>)}</div></div>
  </article>;
}
