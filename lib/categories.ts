import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { supabasePublicEnv } from "@/lib/supabase/env";
import type { Category } from "@/lib/category";
import { parseSizes, type Product } from "@/lib/types";
import { productImageList } from "@/lib/product-images";
import jsonProducts from "@/data/products.json";

export type { Category } from "@/lib/category";
export { RESERVED_CATEGORY_SLUGS, slugifyCategory, storeNavLinks, storeShopLinks } from "@/lib/category";

const fallbackCategories: Category[] = [
  { id: "selecciones", name: "Selecciones", slug: "selecciones", sort_order: 1 },
  { id: "clubes", name: "Clubes", slug: "clubes", sort_order: 2 },
  { id: "retro", name: "Retro", slug: "retro", sort_order: 3 },
];

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!supabasePublicEnv()) return fallbackCategories;
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("id,name,slug,sort_order").order("sort_order").order("name");
  if (error) return fallbackCategories;
  return (data ?? []) as Category[];
});

export const getStoreProducts = cache(async (): Promise<Product[]> => {
  if (!supabasePublicEnv()) return jsonProducts as Product[];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id,slug,name,category,team,price,sizes,badge,image_url,image_urls,active")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (!data?.length) return jsonProducts as Product[];
  return data.map((row) => {
    const images = productImageList(row);
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      team: row.team,
      price: row.price,
      sizes: parseSizes(row.sizes),
      badge: row.badge,
      image: images[0] || "",
      images,
    };
  });
});
