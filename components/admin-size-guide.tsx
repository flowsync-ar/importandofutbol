"use client";

import { Ruler, Trash2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SizeGuideRow } from "@/lib/size-guide";

const blank = { size: "", chest: "", length: "", height: "" };

export function AdminSizeGuide({ rows, onChange }: { rows: SizeGuideRow[]; onChange: (rows: SizeGuideRow[]) => void }) {
  const [list, setList] = useState(rows);
  const [draft, setDraft] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function edit(id: string, key: keyof SizeGuideRow, value: string) {
    setList((current) => current.map((row) => row.id === id ? { ...row, [key]: value } : row));
  }

  async function add(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.size.trim()) { setError("Escribí el talle."); return; }
    setSaving(true); setError(""); setMessage("");
    const { data, error: saveError } = await createClient().from("size_guide_rows").insert({
      size: draft.size.trim(),
      chest: draft.chest.trim(),
      length: draft.length.trim(),
      height: draft.height.trim(),
      sort_order: (list.at(-1)?.sort_order ?? 0) + 1,
    }).select("id,size,chest,length,height,sort_order").single();
    setSaving(false);
    if (saveError || !data) { setError(saveError?.message ?? "No se pudo guardar. Corré supabase/featured.sql en el SQL Editor."); return; }
    const next = [...list, data as SizeGuideRow];
    setList(next); onChange(next); setDraft(blank); setMessage("Talle agregado.");
  }

  async function save(row: SizeGuideRow) {
    const { error: saveError } = await createClient().from("size_guide_rows").update({
      size: row.size.trim(), chest: row.chest.trim(), length: row.length.trim(), height: row.height.trim(),
    }).eq("id", row.id);
    if (saveError) { setError(saveError.message); return; }
    onChange(list); setError(""); setMessage(`Talle ${row.size} guardado.`);
  }

  async function remove(row: SizeGuideRow) {
    if (!window.confirm(`¿Eliminar el talle ${row.size}?`)) return;
    const { error: deleteError } = await createClient().from("size_guide_rows").delete().eq("id", row.id);
    if (deleteError) { setError(deleteError.message); return; }
    const next = list.filter((item) => item.id !== row.id);
    setList(next); onChange(next); setError(""); setMessage("Talle eliminado.");
  }

  return <>
    <header><div><span>TIENDA</span><h1>Guía de talles</h1><p>Estos valores se ven en /guia-de-talles. Medidas en cm, tipo réplica / hincha.</p></div></header>
    {message && <div className="admin-message">{message}<button type="button" onClick={() => setMessage("")}>Cerrar</button></div>}
    {error && <div className="form-error" role="alert">{error}</div>}
    <form className="size-guide-form" onSubmit={add}>
      <label>Talle<input value={draft.size} onChange={(event) => setDraft((current) => ({ ...current, size: event.target.value }))} placeholder="S" aria-label="Talle"/></label>
      <label>Pecho<input value={draft.chest} onChange={(event) => setDraft((current) => ({ ...current, chest: event.target.value }))} placeholder="50–52"/></label>
      <label>Largo<input value={draft.length} onChange={(event) => setDraft((current) => ({ ...current, length: event.target.value }))} placeholder="69–71"/></label>
      <label>Altura<input value={draft.height} onChange={(event) => setDraft((current) => ({ ...current, height: event.target.value }))} placeholder="160–170"/></label>
      <button className="button gold" disabled={saving}>{saving ? "Agregando…" : "Agregar"}</button>
    </form>
    <div className="admin-table-wrap"><table><thead><tr><th>Talle</th><th>Pecho</th><th>Largo</th><th>Altura</th><th/></tr></thead><tbody>
      {list.map((row) => <tr key={row.id}>
        <td><input value={row.size} onChange={(event) => edit(row.id, "size", event.target.value)} aria-label={`Talle ${row.size}`}/></td>
        <td><input value={row.chest} onChange={(event) => edit(row.id, "chest", event.target.value)} aria-label={`Pecho ${row.size}`}/></td>
        <td><input value={row.length} onChange={(event) => edit(row.id, "length", event.target.value)} aria-label={`Largo ${row.size}`}/></td>
        <td><input value={row.height} onChange={(event) => edit(row.id, "height", event.target.value)} aria-label={`Altura ${row.size}`}/></td>
        <td><div className="row-actions"><button type="button" onClick={() => save(row)} aria-label={`Guardar ${row.size}`}>OK</button><button type="button" className="danger" onClick={() => remove(row)} aria-label={`Eliminar ${row.size}`}><Trash2/></button></div></td>
      </tr>)}
    </tbody></table>
    {!list.length && <div className="admin-empty"><Ruler/><p>Todavía no hay filas en la guía.</p></div>}
    </div>
  </>;
}
