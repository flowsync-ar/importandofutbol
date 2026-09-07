import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getStoreProducts } from "@/lib/categories";
import { productCode } from "@/lib/product-code";
import { absoluteUrl, siteOrigin } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getStoreProducts()).find((item) => item.slug === slug);
  if (!product) return { title: "Camiseta" };
  const origin = siteOrigin();
  const image = absoluteUrl(product.image, origin);
  return {
    title: product.name,
    description: `Consultá ${product.name} (${productCode(product)}).`,
    openGraph: {
      title: product.name,
      description: `${product.category} · ${productCode(product)}`,
      url: absoluteUrl(`/camisetas/${product.slug}`, origin) || undefined,
      siteName: "Importando Fútbol LP",
      images: image ? [{ url: image }] : undefined,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = (await getStoreProducts()).find((item) => item.slug === slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
