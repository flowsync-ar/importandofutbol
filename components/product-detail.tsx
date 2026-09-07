"use client";

import Link from "next/link";
import { Check, ChevronLeft, MessageCircle, Minus, Plus, Ruler, ShoppingBag } from "lucide-react";
import { useMemo, useState, type MouseEvent } from "react";
import { useStore } from "@/components/store-provider";
import { WhatsAppConsult } from "@/components/whatsapp-consult";
import { productPhotos } from "@/lib/product-images";
import { formatPrice, type Product } from "@/lib/types";
import { productCode, productPicksConsultMessage } from "@/lib/product-code";

function followZoom(event: MouseEvent<HTMLDivElement>) {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--zoom-x", `${((event.clientX - box.left) / box.width) * 100}%`);
  event.currentTarget.style.setProperty("--zoom-y", `${((event.clientY - box.top) / box.height) * 100}%`);
}

function bumpQty(current: Record<string, number>, size: string, delta: number) {
  const next = Math.max(0, Math.min(99, (current[size] ?? 0) + delta));
  if (!next) {
    const { [size]: _, ...rest } = current;
    return rest;
  }
  return { ...current, [size]: next };
}

export function ProductDetail({ product }: { product: Product }) {
  const photos = productPhotos(product);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [photoIndex, setPhotoIndex] = useState(0);
  const { addToCart, storePhone } = useStore();
  const picks = useMemo(
    () => product.sizes.map((size) => ({ size, quantity: qty[size] ?? 0 })).filter((pick) => pick.quantity > 0),
    [product.sizes, qty],
  );
  const message = productPicksConsultMessage(product, picks);
  const photo = photos[photoIndex] ?? photos[0];
  const total = picks.reduce((sum, pick) => sum + pick.quantity, 0);

  function addPicks() {
    picks.forEach((pick) => addToCart({
      id: product.id, name: product.name, size: pick.size, quantity: pick.quantity,
      code: productCode(product), slug: product.slug, image: photos[0] ?? null,
    }));
    setQty({});
  }

  return <section className="page-shell container"><Link className="back-link" href="/camisetas"><ChevronLeft/> Volver al catálogo</Link><div className="product-detail">
    <div className="detail-visual">
      <div className={`detail-gallery${photo ? " has-photo" : ""}`}>{photo ? <div className="detail-zoom" onMouseMove={followZoom}><img src={photo} alt={product.name}/></div> : <span className={`jersey ${product.category === "Selecciones" ? "sky" : product.category === "Retro" ? "retro" : "club"}`}/>}</div>
      {photos.length > 1 && <div className="detail-thumbs">{photos.map((src, index) => <button type="button" className={index === photoIndex ? "selected" : ""} key={src} onClick={() => setPhotoIndex(index)} aria-label={`Foto ${index + 1}`}><img src={src} alt=""/></button>)}</div>}
    </div>
    <div className="detail-copy"><span className="eyebrow dark">{product.category}</span><p className="product-code">{productCode(product)}</p><h1>{product.name}</h1><p className="detail-price">{formatPrice(product.price) ?? "Precio a consultar"}</p><p>Consultá disponibilidad, versión y opciones de personalización antes de confirmar.</p>
      <div className="size-heading"><strong>Talles y cantidad</strong><Link href="/guia-de-talles"><Ruler/> Guía de talles</Link></div>
      {product.sizes.length ? <div className="size-picks">{product.sizes.map((size) => {
        const count = qty[size] ?? 0;
        return <div className={`size-pick${count ? " has-qty" : ""}`} key={size}>
          <span>{size}</span>
          <div className="qty-step">
            <button type="button" onClick={() => setQty((current) => bumpQty(current, size, -1))} disabled={!count} aria-label={`Menos ${size}`}><Minus/></button>
            <strong>{count}</strong>
            <button type="button" onClick={() => setQty((current) => bumpQty(current, size, 1))} aria-label={`Más ${size}`}><Plus/></button>
          </div>
        </div>;
      })}</div> : <small>Este producto no tiene talles cargados.</small>}
      <button className="button gold full" disabled={!total} onClick={addPicks}><ShoppingBag/> Agregar a consulta{total ? ` (${total})` : ""}</button>
      <WhatsAppConsult className="button whatsapp-button full" storePhone={storePhone} message={message} consultMedia={{ slug: product.slug, image: photo }}><MessageCircle/> Consultar por WhatsApp</WhatsAppConsult>
      <ul className="detail-notes"><li><Check/> Atención personalizada</li><li><Check/> Confirmación de stock antes del pedido</li></ul>
    </div>
  </div></section>;
}
