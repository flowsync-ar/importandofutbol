import { notFound } from "next/navigation";
import { Catalog } from "@/components/catalog";
import products from "@/data/products.json";

const categories: Record<string, string> = { selecciones: "Selecciones", clubes: "Clubes", retro: "Retro" };
export function generateStaticParams() { return Object.keys(categories).map((category) => ({ category })); }
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; const label = categories[category]; if (!label) notFound(); return <section className="page-shell container"><span className="breadcrumb">Inicio / {label}</span><div className="page-title"><span className="eyebrow dark">COLECCIÓN</span><h1>{label}</h1><p>Explorá nuestra selección y encontrá tu próximo escudo.</p></div><Catalog products={products} initialCategory={label}/></section>; }
