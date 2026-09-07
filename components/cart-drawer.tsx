"use client";

import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { cartConsultMessage, productCode } from "@/lib/product-code";
import { WhatsAppConsult } from "./whatsapp-consult";
import { useStore } from "./store-provider";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, changeQuantity, removeFromCart, storePhone } = useStore();
  if (!open) return null;
  const message = cartConsultMessage(cart);
  const consultMedia = cart.map((item) => ({ slug: item.slug, image: item.image }));
  return <div className="drawer-backdrop" onClick={onClose}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()} aria-label="Carrito de consulta"><header><div><span>MI SELECCIÓN</span><h2>Carrito de consulta</h2></div><button onClick={onClose} aria-label="Cerrar carrito"><X/></button></header>{cart.length ? <><div className="cart-items">{cart.map((item) => <article key={`${item.id}-${item.size}`}><div className="cart-thumb"><ShoppingBag/></div><div><strong>{item.name}</strong><span>{productCode(item)} · Talle {item.size}</span><div className="qty-step cart-qty"><button type="button" onClick={() => changeQuantity(item.id, item.size, -1)} aria-label={`Menos ${item.name} ${item.size}`}><Minus/></button><strong>{item.quantity ?? 1}</strong><button type="button" onClick={() => changeQuantity(item.id, item.size, 1)} aria-label={`Más ${item.name} ${item.size}`}><Plus/></button></div></div><button onClick={() => removeFromCart(item.id,item.size)} aria-label={`Quitar ${item.name}`}><Trash2/></button></article>)}</div><WhatsAppConsult className="button whatsapp-button full" storePhone={storePhone} message={message} consultMedia={consultMedia}><MessageCircle/> Consultar todo por WhatsApp</WhatsAppConsult></> : <div className="cart-empty"><ShoppingBag/><h3>Tu selección está vacía</h3><p>Agregá una camiseta y su talle para preparar la consulta.</p></div>}</aside></div>;
}
