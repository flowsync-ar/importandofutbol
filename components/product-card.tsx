import Link from "next/link";
import { formatPrice, type Product } from "@/lib/types";
import { productPhotos } from "@/lib/product-images";

const jerseyClass: Record<string, string> = { Selecciones: "sky", Clubes: "club", Retro: "retro" };

export function ProductCard({ product }: { product: Product }) {
  const photo = productPhotos(product)[0];
  return <article className="product-card">
    <div className="product-visual">
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <Link href={`/camisetas/${product.slug}`} aria-label={`Ver ${product.name}`}>{photo ? <img className="product-photo" src={photo} alt={product.name}/> : <span className={`jersey ${jerseyClass[product.category] ?? ""}`}/>}</Link>
    </div>
    <div className="product-info"><span>{product.category}</span><Link href={`/camisetas/${product.slug}`}><h3>{product.name}</h3></Link><strong>{formatPrice(product.price) ?? "Consultar precio"}</strong><div className="size-list">{product.sizes.map((size) => <small key={size}>{size}</small>)}</div></div>
  </article>;
}
