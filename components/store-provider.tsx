"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem } from "@/lib/types";

type StoreContextValue = {
  favorites: string[];
  cart: CartItem[];
  toggleFavorite: (id: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) ?? "") as T; } catch { return fallback; }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setFavorites(readStorage("iflp-favorites", []));
    setCart(readStorage("iflp-cart", []));
  }, []);

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

  return <StoreContext.Provider value={{ favorites, cart, toggleFavorite, addToCart, removeFromCart }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}
