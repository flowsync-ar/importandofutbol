import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/category";
import type { Product } from "@/lib/types";
import jsonProducts from "@/data/products.json";

export type { Category } from "@/lib/category";
export { RESERVED_CATEGORY_SLUGS, slugifyCategory, storeNavLinks, storeShopLinks } from "@/lib/category";

const fallbackCategories: Category[] = [
  { id: "selecciones", name: "Selecciones", slug: "selecciones", sort_order: 1 },
  { id: "clubes", name: "Clubes", slug: "clubes", sort_order: 2 },
  { id: "retro", name: "Retro", slug: "retro", sort_order: 3 },
];

export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("id,name,slug,sort_order").order("sort_order").order("name");
  if (error) return fallbackCategories;
  return (data ?? []) as Category[];
});

export const getStoreProducts = cache(async (): Promise<Product[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id,slug,name,category,team,price,sizes,badge,image_url,image_urls,active")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (!data?.length) return jsonProducts as Product[];
  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    team: row.team,
    price: row.price,
    sizes: row.sizes,
    badge: row.badge,
    image: (row.image_urls?.[0] || row.image_url || "") as string,
  }));
});
