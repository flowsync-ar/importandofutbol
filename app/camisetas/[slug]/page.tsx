import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getStoreProducts } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = (await getStoreProducts()).find((item) => item.slug === slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
