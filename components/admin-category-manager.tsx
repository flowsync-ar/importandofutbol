"use client";

import { Tags, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Category } from "@/lib/category";
import { RESERVED_CATEGORY_SLUGS, slugifyCategory } from "@/lib/category";
import { createClient } from "@/lib/supabase/client";

export function AdminCategoryManager({
  categories,
  usedNames,
  onChange,
}: {
  categories: Category[];
  usedNames: string[];
  onChange: (categories: Category[]) => void;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function add(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    const slug = slugifyCategory(trimmed);
    if (!trimmed) { setError("Escribí un nombre."); return; }
    if (RESERVED_CATEGORY_SLUGS.has(slug)) { setError("Ese nombre está reservado para otra página del sitio."); return; }
    if (categories.some((category) => category.slug === slug || category.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("Esa categoría ya existe.");
      return;
    }
    setSaving(true); setError(""); setMessage("");
    const { data, error: saveError } = await createClient().from("categories").insert({
      name: trimmed,
      slug,
      sort_order: (categories.at(-1)?.sort_order ?? 0) + 1,
    }).select("id,name,slug,sort_order").single();
    setSaving(false);
    if (saveError || !data) { setError(saveError?.message ?? "No se pudo crear la categoría."); return; }
    onChange([...categories, data as Category]);
    setName("");
    setMessage("Categoría creada.");
  }

  async function remove(category: Category) {
    if (usedNames.includes(category.name)) {
      setError(`No se puede borrar “${category.name}” porque hay productos en esa categoría.`);
      return;
    }
    if (!window.confirm(`¿Eliminar la categoría ${category.name}?`)) return;
    const { error: deleteError } = await createClient().from("categories").delete().eq("id", category.id);
    if (deleteError) { setError(deleteError.message); return; }
    onChange(categories.filter((item) => item.id !== category.id));
    setError("");
    setMessage("Categoría eliminada.");
  }

  return <>
    <header><div><span>CATÁLOGO</span><h1>Categorías</h1><p>Creá las colecciones que se ven en el menú y en los productos.</p></div></header>
    {message && <div className="admin-message">{message}<button type="button" onClick={() => setMessage("")}>Cerrar</button></div>}
    {error && <div className="form-error" role="alert">{error}</div>}
    <form className="category-form" onSubmit={add}>
      <label>Nueva categoría<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Niños, Premier League…" aria-label="Nombre de la categoría"/></label>
      <button className="button gold" disabled={saving}>{saving ? "Agregando…" : "Agregar"}</button>
    </form>
    <div className="admin-table-wrap"><table><thead><tr><th>Nombre</th><th>Enlace</th><th/></tr></thead><tbody>
      {categories.map((category) => <tr key={category.id}><td><strong>{category.name}</strong></td><td>/{category.slug}</td><td><div className="row-actions"><button className="danger" onClick={() => remove(category)} aria-label={`Eliminar ${category.name}`}><Trash2/></button></div></td></tr>)}
    </tbody></table>
    {!categories.length && <div className="admin-empty"><Tags/><p>Todavía no hay categorías.</p></div>}
    </div>
  </>;
}
