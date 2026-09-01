"use client";

import { MessageCircle, ShoppingBag, Trash2, X } from "lucide-react";
import { storeWhatsAppHref } from "@/lib/customer";
import { useStore } from "./store-provider";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, removeFromCart } = useStore();
  if (!open) return null;
  const message = cart.length
    ? `Hola, quiero consultar por:\n${cart.map((item) => `• ${item.name} — talle ${item.size} — cantidad ${item.quantity ?? 1}`).join("\n")}`
    : "Hola, quiero consultar por camisetas";
  return <div className="drawer-backdrop" onClick={onClose}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()} aria-label="Carrito de consulta"><header><div><span>MI SELECCIÓN</span><h2>Carrito de consulta</h2></div><button onClick={onClose} aria-label="Cerrar carrito"><X/></button></header>{cart.length ? <><div className="cart-items">{cart.map((item) => <article key={`${item.id}-${item.size}`}><div className="cart-thumb"><ShoppingBag/></div><div><strong>{item.name}</strong><span>Talle {item.size} · Cantidad {item.quantity ?? 1}</span></div><button onClick={() => removeFromCart(item.id,item.size)} aria-label={`Quitar ${item.name}`}><Trash2/></button></article>)}</div><a className="button whatsapp-button full" href={storeWhatsAppHref(message)} target="_blank" rel="noreferrer"><MessageCircle/> Consultar todo por WhatsApp</a></> : <div className="cart-empty"><ShoppingBag/><h3>Tu selección está vacía</h3><p>Agregá una camiseta y su talle para preparar la consulta.</p></div>}</aside></div>;
}
