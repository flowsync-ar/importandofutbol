import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { supabasePublicEnv } from "@/lib/supabase/env";
import type { Category } from "@/lib/category";
import { parsePrice, parseSizes, type Product } from "@/lib/types";
import { productImageList } from "@/lib/product-images";
import jsonProducts from "@/data/products.json";
import type { Ad } from "@/lib/ads";
import { DEFAULT_CONTACTS, type ContactChannel } from "@/lib/contacts";

const productColumns = "id,slug,name,category,team,price,sizes,badge,image_url,image_urls,active,featured,featured_title";
const productColumnsFallback = "id,slug,name,category,team,price,sizes,badge,image_url,image_urls,active";

function mapStoreProduct(row: {
  id: string; slug: string; name: string; category: string; team: string;
  price: string | number | null; sizes: string[] | string | null; badge: string | null;
  image_url?: string | null; image_urls?: string[] | null;
  featured?: boolean | null; featured_title?: string | null;
}): Product {
  const images = productImageList(row);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    team: row.team,
    price: parsePrice(row.price),
    sizes: parseSizes(row.sizes),
    badge: row.badge,
    image: images[0] || "",
    images,
    featured: Boolean(row.featured),
    featured_title: row.featured_title || null,
  };
}

export type { Category } from "@/lib/category";
export { RESERVED_CATEGORY_SLUGS, slugifyCategory, slugifyProduct, storeNavLinks, storeShopLinks, storeCategoryLinks } from "@/lib/category";

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
  const featured = await supabase.from("products").select(productColumns).eq("active", true).order("created_at", { ascending: false });
  const rows = featured.data ?? (await supabase.from("products").select(productColumnsFallback).eq("active", true).order("created_at", { ascending: false })).data;
  if (!rows?.length) return jsonProducts as Product[];
  return rows.map((row) => mapStoreProduct(row));
});

export const getAds = cache(async (): Promise<Ad[]> => {
  if (!supabasePublicEnv()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("ads").select("id,slot,title,description,href,image_url,active");
  if (error || !data) return [];
  return data as Ad[];
});

export const getContactChannels = cache(async (): Promise<ContactChannel[]> => {
  if (!supabasePublicEnv()) return DEFAULT_CONTACTS;
  const supabase = await createClient();
  const { data, error } = await supabase.from("contact_channels").select("id,name,value,button_label,href,sort_order").order("sort_order").order("name");
  if (error || !data?.length) return DEFAULT_CONTACTS;
  return data as ContactChannel[];
});
