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
  featured?: boolean;
  featured_title?: string | null;
};

export function parseSizes(value: string | string[] | null | undefined) {
  const parts = Array.isArray(value) ? value : String(value ?? "").split(",");
  return parts.map((size) => size.trim()).filter(Boolean);
}

export const CATALOG_SIZES = ["S", "M", "L", "XL", "XXL"];

export function featuredProducts(products: Product[]) {
  return products.filter((product) => product.featured);
}

export type CartItem = { id: string; name: string; size: string; quantity?: number };
