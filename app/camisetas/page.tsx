import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import products from "@/data/products.json";

export const metadata: Metadata = { title: "Camisetas" };
export default function JerseysPage() { return <section className="page-shell container"><span className="breadcrumb">Inicio / Camisetas</span><div className="page-title"><span className="eyebrow dark">CATÁLOGO</span><h1>Todas las camisetas</h1><p>Clubes, selecciones y clásicos que nunca pasan de moda.</p></div><Catalog products={products}/></section>; }
