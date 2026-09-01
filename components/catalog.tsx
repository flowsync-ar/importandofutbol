"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

export function Catalog({ products, initialCategory, categoryNames }: { products: Product[]; initialCategory?: string; categoryNames?: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "Todas");
  const [size, setSize] = useState("Todos");
  const [sort, setSort] = useState("relevancia");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const categories = categoryNames?.length ? categoryNames : [...new Set(products.map((product) => product.category))];
  const sizeOptions = [...new Set(products.flatMap((product) => product.sizes))];
  const results = useMemo(() => products.filter((p) => (!query || `${p.name} ${p.team}`.toLowerCase().includes(query.toLowerCase())) && (category === "Todas" || p.category === category) && (size === "Todos" || p.sizes.includes(size))).sort((a, b) => sort === "nombre" ? a.name.localeCompare(b.name) : 0), [products, query, category, size, sort]);

  return <div className="catalog-layout">
    {filtersOpen && <button className="filter-backdrop" aria-label="Cerrar filtros" onClick={() => setFiltersOpen(false)}/>}<aside className={`filters ${filtersOpen ? "open" : ""}`}><div className="filter-title"><SlidersHorizontal/> Filtros <button onClick={() => setFiltersOpen(false)} aria-label="Cerrar panel de filtros"><X/></button></div><label>Buscar<input aria-label="Buscar camisetas" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Equipo o camiseta"/></label><label>Categoría<select value={category} onChange={(e) => setCategory(e.target.value)}><option>Todas</option>{categories.map((name) => <option key={name}>{name}</option>)}</select></label><label>Talle<select value={size} onChange={(e) => setSize(e.target.value)}><option>Todos</option>{(sizeOptions.length ? sizeOptions : ["S", "M", "L", "XL"]).map((s) => <option key={s}>{s}</option>)}</select></label><button className="button gold apply-filters" onClick={() => setFiltersOpen(false)}>Ver {results.length} resultados</button></aside>
    <div className="catalog-content"><button className="mobile-filter-button" onClick={() => setFiltersOpen(true)}><SlidersHorizontal/> Filtrar y buscar</button><div className="catalog-toolbar"><span>{results.length} camisetas</span><label>Ordenar <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="relevancia">Relevancia</option><option value="nombre">Nombre</option></select></label></div>{results.length ? <div className="product-grid">{results.map((p) => <ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><Search/><h2>No encontramos camisetas</h2><p>Probá con otro equipo, categoría o talle.</p></div>}</div>
  </div>;
}
