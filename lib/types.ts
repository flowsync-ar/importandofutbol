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
};

export type CartItem = { id: string; name: string; size: string; quantity?: number };
