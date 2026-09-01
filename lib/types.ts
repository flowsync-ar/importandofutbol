export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  team: string;
  price: number | null;
  sizes: string[];
  badge: string | null;
  image: string;
  images?: string[];
};

export function parseSizes(value: string | string[] | null | undefined) {
  const parts = Array.isArray(value) ? value : String(value ?? "").split(",");
  return parts.map((size) => size.trim()).filter(Boolean);
}

export type CartItem = { id: string; name: string; size: string; quantity?: number };
