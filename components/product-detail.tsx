"use client";

import Link from "next/link";
import { Check, ChevronLeft, MessageCircle, Ruler, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/store-provider";
import { storeWhatsAppHref } from "@/lib/customer";
import { productPhotos } from "@/lib/product-images";
import { formatPrice, type Product } from "@/lib/types";

export function ProductDetail({ product }: { product: Product }) {
  const photos = productPhotos(product);
  const [size, setSize] = useState("");
  const [photoIndex, setPhotoIndex] = useState(0);
  const { addToCart } = useStore();
  const message = `Hola, quiero consultar por ${product.name}${size ? `, talle ${size}` : ""}.`;
  const photo = photos[photoIndex] ?? photos[0];
  return <section className="page-shell container"><Link className="back-link" href="/camisetas"><ChevronLeft/> Volver al catálogo</Link><div className="product-detail">
    <div className="detail-visual">
      <div className={`detail-gallery${photo ? " has-photo" : ""}`}>{photo ? <img src={photo} alt={product.name}/> : <span className={`jersey ${product.category === "Selecciones" ? "sky" : product.category === "Retro" ? "retro" : "club"}`}/>}</div>
      {photos.length > 1 && <div className="detail-thumbs">{photos.map((src, index) => <button type="button" className={index === photoIndex ? "selected" : ""} key={src} onClick={() => setPhotoIndex(index)} aria-label={`Foto ${index + 1}`}><img src={src} alt=""/></button>)}</div>}
    </div>
    <div className="detail-copy"><span className="eyebrow dark">{product.category}</span><h1>{product.name}</h1><p className="detail-price">{formatPrice(product.price) ?? "Precio a consultar"}</p><p>Consultá disponibilidad, versión y opciones de personalización antes de confirmar.</p><div className="size-heading"><strong>Elegí tu talle</strong><Link href="/guia-de-talles"><Ruler/> Guía de talles</Link></div><div className="detail-sizes">{product.sizes.length ? product.sizes.map((item) => <button type="button" className={size === item ? "selected" : ""} key={item} onClick={() => setSize(item)}>{item}</button>) : <small>Este producto no tiene talles cargados.</small>}</div><button className="button gold full" disabled={!size} onClick={() => addToCart({ id: product.id, name: product.name, size })}><ShoppingBag/> Agregar a consulta</button><a className="button whatsapp-button full" href={storeWhatsAppHref(message)} target="_blank" rel="noreferrer"><MessageCircle/> Consultar por WhatsApp</a><ul className="detail-notes"><li><Check/> Atención personalizada</li><li><Check/> Confirmación de stock antes del pedido</li></ul></div>
  </div></section>;
}
