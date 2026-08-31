import { notFound } from "next/navigation";
import { Catalog } from "@/components/catalog";
import { getCategories, getStoreProducts } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const [categories, products] = await Promise.all([getCategories(), getStoreProducts()]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  return <section className="page-shell container"><span className="breadcrumb">Inicio / {category.name}</span><div className="page-title"><span className="eyebrow dark">COLECCIÓN</span><h1>{category.name}</h1><p>Explorá nuestra selección y encontrá tu próximo escudo.</p></div><Catalog products={products} initialCategory={category.name} categoryNames={categories.map((item) => item.name)}/></section>;
}
