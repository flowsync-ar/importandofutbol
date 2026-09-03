"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem } from "@/lib/types";
import { STORE_WHATSAPP } from "@/lib/customer";

type StoreContextValue = {
  favorites: string[];
  cart: CartItem[];
  storePhone: string;
  toggleFavorite: (id: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);


export function StoreProvider({ children, storePhone = STORE_WHATSAPP }: { children: React.ReactNode; storePhone?: string }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // ponytail: sin login no hay usuario → carrito y favoritos arrancan vacíos siempre

  const toggleFavorite = (id: string) => setFavorites((current) => {
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    localStorage.setItem("iflp-favorites", JSON.stringify(next));
    return next;
  });

  const addToCart = (item: CartItem) => setCart((current) => {
    const existing = current.find((currentItem) => currentItem.id === item.id && currentItem.size === item.size);
    const next = existing
      ? current.map((currentItem) => currentItem === existing ? { ...currentItem, quantity: (currentItem.quantity ?? 1) + (item.quantity ?? 1) } : currentItem)
      : [...current, { ...item, quantity: item.quantity ?? 1 }];
    localStorage.setItem("iflp-cart", JSON.stringify(next));
    return next;
  });

  const removeFromCart = (id: string, size: string) => setCart((current) => {
    const next = current.filter((item) => item.id !== id || item.size !== size);
    localStorage.setItem("iflp-cart", JSON.stringify(next));
    return next;
  });

  return <StoreContext.Provider value={{ favorites, cart, storePhone, toggleFavorite, addToCart, removeFromCart }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}
