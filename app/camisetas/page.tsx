import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { getCategories, getStoreProducts } from "@/lib/categories";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Camisetas" };

export default async function JerseysPage() {
  const [categories, products] = await Promise.all([getCategories(), getStoreProducts()]);
  return <section className="page-shell container"><span className="breadcrumb">Inicio / Camisetas</span><div className="page-title"><span className="eyebrow dark">CATÁLOGO</span><h1>Todas las camisetas</h1><p>Clubes, selecciones y clásicos que nunca pasan de moda.</p></div><Catalog products={products} categoryNames={categories.map((item) => item.name)}/></section>;
}
