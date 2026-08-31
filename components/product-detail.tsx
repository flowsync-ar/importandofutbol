"use client";

import Link from "next/link";
import { Check, ChevronLeft, MessageCircle, Ruler, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/store-provider";
import type { Product } from "@/lib/types";

export function ProductDetail({ product }: { product: Product }) {
  const [size, setSize] = useState("");
  const { addToCart } = useStore();
  const message = `Hola, quiero consultar por ${product.name}${size ? `, talle ${size}` : ""}.`;
  return <section className="page-shell container"><Link className="back-link" href="/camisetas"><ChevronLeft/> Volver al catálogo</Link><div className="product-detail"><div className="detail-gallery"><span className={`jersey ${product.category === "Selecciones" ? "sky" : product.category === "Retro" ? "retro" : "club"}`}/></div><div className="detail-copy"><span className="eyebrow dark">{product.category}</span><h1>{product.name}</h1><p className="detail-price">{product.price ? `$ ${product.price.toLocaleString("es-AR")}` : "Precio a consultar"}</p><p>Consultá disponibilidad, versión y opciones de personalización antes de confirmar.</p><div className="size-heading"><strong>Elegí tu talle</strong><Link href="/guia-de-talles"><Ruler/> Guía de talles</Link></div><div className="detail-sizes">{product.sizes.map((item) => <button className={size === item ? "selected" : ""} key={item} onClick={() => setSize(item)}>{item}</button>)}</div><button className="button gold full" disabled={!size} onClick={() => addToCart({ id: product.id, name: product.name, size })}><ShoppingBag/> Agregar a consulta</button><a className="button whatsapp-button full" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer"><MessageCircle/> Consultar por WhatsApp</a><ul className="detail-notes"><li><Check/> Atención personalizada</li><li><Check/> Confirmación de stock antes del pedido</li></ul></div></div></section>;
}
