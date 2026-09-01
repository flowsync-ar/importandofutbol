import type { SupabaseClient } from "@supabase/supabase-js";

export const PRODUCT_IMAGES_BUCKET = "product-images";
export const PRODUCT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const PRODUCT_IMAGE_MAX_COUNT = 8;
export const PRODUCT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

const allowedTypes = new Set<string>(PRODUCT_IMAGE_TYPES);

export function validateProductImage(file: File) {
  if (!allowedTypes.has(file.type)) return "Usá una imagen JPG, PNG, WEBP o AVIF.";
  if (file.size > PRODUCT_IMAGE_MAX_BYTES) return "La imagen no puede superar 5 MB.";
  return null;
}

function extensionFor(file: File) {
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "avif";
}

export async function uploadProductImage(supabase: SupabaseClient, file: File, slug: string) {
  const validationError = validateProductImage(file);
  if (validationError) return { url: null as string | null, error: validationError };

  const path = `${slug}/${crypto.randomUUID()}.${extensionFor(file)}`;
  const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

export function productImageList(product: { image_url?: string | null; image_urls?: string[] | null }) {
  if (product.image_urls?.length) return product.image_urls.filter(Boolean);
  return product.image_url ? [product.image_url] : [];
}

export function productPhotos(product: { image?: string | null; images?: string[] | null }) {
  const list = product.images?.length ? product.images.filter(Boolean) : product.image ? [product.image] : [];
  return list.filter((src) => !src.includes("placeholder"));
}

export async function uploadProductImages(supabase: SupabaseClient, files: File[], slug: string) {
  const results = await Promise.all(files.map((file) => uploadProductImage(supabase, file, slug)));
  const failed = results.find((result) => result.error);
  if (failed?.error) return { urls: [] as string[], error: failed.error };
  return { urls: results.map((result) => result.url as string), error: null };
}
