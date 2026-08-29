"use client";

import { LogOut, PackagePlus, Pencil, Search, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type AdminProduct = {
  id: string; slug: string; name: string; category: string; team: string;
  price: number | null; sizes: string[]; badge: string | null; image_url: string | null; active: boolean;
};

const emptyProduct: Omit<AdminProduct, "id"> = { slug:"", name:"", category:"Clubes", team:"", price:null, sizes:["M","L"], badge:null, image_url:null, active:true };

export function AdminProductManager({ initialProducts, email }: { initialProducts: AdminProduct[]; email: string }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const filtered = useMemo(() => products.filter((product) => `${product.name} ${product.team}`.toLowerCase().includes(query.toLowerCase())), [products, query]);

  async function signOut() { const supabase = createClient(); await supabase.auth.signOut(); router.replace("/admin/login"); router.refresh(); }
  async function remove(product: AdminProduct) {
    if (!window.confirm(`¿Eliminar ${product.name}?`)) return;
    const { error } = await createClient().from("products").delete().eq("id", product.id);
    if (error) { setMessage(`No se pudo eliminar: ${error.message}`); return; }
    setProducts((current) => current.filter((item) => item.id !== product.id));
    setMessage("Producto eliminado.");
  }
  function saved(product: AdminProduct) {
    setProducts((current) => current.some((item) => item.id === product.id) ? current.map((item) => item.id === product.id ? product : item) : [product, ...current]);
    setEditing(null); setCreating(false); setMessage("Cambios guardados.");
  }

  return <div className="admin-shell"><aside className="admin-sidebar"><div><strong>IMPORTANDO FÚTBOL</strong><span>Administración</span></div><nav><a className="active"><PackagePlus/> Productos</a></nav><button onClick={signOut}><LogOut/> Cerrar sesión</button></aside><main className="admin-main"><header><div><span>CATÁLOGO</span><h1>Productos</h1><p>Sesión iniciada como {email}</p></div><button className="button gold" onClick={() => setCreating(true)}><PackagePlus/> Nuevo producto</button></header>{message && <div className="admin-message">{message}<button onClick={() => setMessage("")}><X/></button></div>}<div className="admin-toolbar"><Search/><input aria-label="Buscar productos" placeholder="Buscar por nombre o equipo" value={query} onChange={(event) => setQuery(event.target.value)}/><strong>{filtered.length} productos</strong></div><div className="admin-table-wrap"><table><thead><tr><th>Producto</th><th>Categoría</th><th>Talles</th><th>Precio</th><th>Estado</th><th/></tr></thead><tbody>{filtered.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><span>{product.team}</span></td><td>{product.category}</td><td>{product.sizes.join(", ")}</td><td>{product.price === null ? "A consultar" : `$ ${product.price.toLocaleString("es-AR")}`}</td><td><i className={product.active ? "status active" : "status"}>{product.active ? "Publicado" : "Oculto"}</i></td><td><div className="row-actions"><button onClick={() => setEditing(product)} aria-label={`Editar ${product.name}`}><Pencil/></button><button className="danger" onClick={() => remove(product)} aria-label={`Eliminar ${product.name}`}><Trash2/></button></div></td></tr>)}</tbody></table>{!filtered.length && <div className="admin-empty">No hay productos para mostrar.</div>}</div></main>{(editing || creating) && <ProductEditor product={editing ?? emptyProduct} onClose={() => { setEditing(null); setCreating(false); }} onSaved={saved}/>}</div>;
}

function ProductEditor({ product, onClose, onSaved }: { product: AdminProduct | Omit<AdminProduct,"id">; onClose:()=>void; onSaved:(product:AdminProduct)=>void }) {
  const [form, setForm] = useState(product);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const update = (key: string, value: unknown) => setForm((current) => ({ ...current, [key]: value }));
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    const rawPrice = String(form.price ?? "").trim();
    const payload = { ...form, slug: form.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""), price: rawPrice === "" ? null : Number(rawPrice), badge: form.badge || null, image_url: form.image_url || null };
    const query = "id" in product ? createClient().from("products").update(payload).eq("id",product.id).select().single() : createClient().from("products").insert(payload).select().single();
    const { data, error: saveError } = await query;
    if (saveError) { setError(saveError.message); setSaving(false); return; }
    onSaved(data as AdminProduct);
  }
  return <div className="drawer-backdrop" onClick={onClose}><form className="product-editor" onSubmit={submit} onClick={(event)=>event.stopPropagation()}><header><div><span>{"id" in product ? "EDITAR" : "NUEVO"}</span><h2>Producto</h2></div><button type="button" onClick={onClose}><X/></button></header><div className="editor-grid"><label className="wide">Nombre<input value={form.name} onChange={(event)=>update("name",event.target.value)} required/></label><label>Slug<input value={form.slug} onChange={(event)=>update("slug",event.target.value)} required/></label><label>Equipo<input value={form.team} onChange={(event)=>update("team",event.target.value)} required/></label><label>Categoría<select value={form.category} onChange={(event)=>update("category",event.target.value)}><option>Clubes</option><option>Selecciones</option><option>Retro</option></select></label><label>Precio<input type="number" min="0" step="0.01" value={form.price ?? ""} onChange={(event)=>update("price",event.target.value)} placeholder="Dejar vacío para consultar"/></label><label>Talles<input value={form.sizes.join(", ")} onChange={(event)=>update("sizes",event.target.value.split(",").map((size)=>size.trim()).filter(Boolean))} placeholder="S, M, L, XL"/></label><label>Etiqueta<input value={form.badge ?? ""} onChange={(event)=>update("badge",event.target.value)} placeholder="Nueva, Top…"/></label><label className="wide">URL de imagen<input type="url" value={form.image_url ?? ""} onChange={(event)=>update("image_url",event.target.value)} placeholder="https://…"/></label><label className="checkbox"><input type="checkbox" checked={form.active} onChange={(event)=>update("active",event.target.checked)}/> Producto publicado</label></div>{error && <div className="form-error">{error}</div>}<button className="button gold full" disabled={saving}>{saving ? "Guardando…" : "Guardar producto"}</button></form></div>;
}
