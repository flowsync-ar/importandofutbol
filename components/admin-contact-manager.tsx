"use client";

import { Pencil, Phone, Trash2, X } from "lucide-react";
import { useState } from "react";
import { blankToNull } from "@/lib/customer";
import { contactHref, type ContactChannel } from "@/lib/contacts";
import { createClient } from "@/lib/supabase/client";

const emptyContact: Omit<ContactChannel, "id"> = { name: "", value: "", button_label: "Abrir", href: null, sort_order: 0 };

export function AdminContactManager({
  contacts,
  onChange,
}: {
  contacts: ContactChannel[];
  onChange: (contacts: ContactChannel[]) => void;
}) {
  const [editing, setEditing] = useState<ContactChannel | null>(null);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function remove(contact: ContactChannel) {
    if (!window.confirm(`¿Eliminar ${contact.name}?`)) return;
    const { error: deleteError } = await createClient().from("contact_channels").delete().eq("id", contact.id);
    if (deleteError) { setError(deleteError.message); return; }
    onChange(contacts.filter((item) => item.id !== contact.id));
    setError("");
    setMessage("Contacto eliminado.");
  }

  function saved(contact: ContactChannel) {
    onChange(contacts.some((item) => item.id === contact.id) ? contacts.map((item) => item.id === contact.id ? contact : item) : [...contacts, contact].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, "es")));
    setEditing(null);
    setCreating(false);
    setError("");
    setMessage("Contacto guardado.");
  }

  return <>
    <header><div><span>TIENDA</span><h1>Contactos</h1><p>Aparecen en Contacto y en el pie. Sumá TikTok u otra red cuando la tengan.</p></div><button className="button gold" onClick={() => { setCreating(true); setEditing(null); }}>Nuevo contacto</button></header>
    {message && <div className="admin-message">{message}<button type="button" onClick={() => setMessage("")}><X/></button></div>}
    {error && <div className="form-error" role="alert">{error}</div>}
    <div className="admin-table-wrap"><table><thead><tr><th>Canal</th><th>Dato</th><th>Botón</th><th/></tr></thead><tbody>
      {contacts.map((contact) => <tr key={contact.id}><td><strong>{contact.name}</strong></td><td>{contact.value}</td><td>{contact.button_label}</td><td><div className="row-actions"><button onClick={() => { setEditing(contact); setCreating(false); }} aria-label={`Editar ${contact.name}`}><Pencil/></button><button className="danger" onClick={() => remove(contact)} aria-label={`Eliminar ${contact.name}`}><Trash2/></button></div></td></tr>)}
    </tbody></table>
    {!contacts.length && <div className="admin-empty"><Phone/><p>Todavía no hay contactos.</p></div>}
    </div>
    {(editing || creating) && <ContactEditor contact={editing ?? { ...emptyContact, sort_order: (contacts.at(-1)?.sort_order ?? 0) + 1 }} onClose={() => { setEditing(null); setCreating(false); }} onSaved={saved}/>}
  </>;
}

function ContactEditor({ contact, onClose, onSaved }: { contact: ContactChannel | Omit<ContactChannel, "id">; onClose: () => void; onSaved: (contact: ContactChannel) => void }) {
  const [form, setForm] = useState({
    name: contact.name,
    value: contact.value,
    button_label: contact.button_label,
    href: contact.href ?? "",
    sort_order: contact.sort_order,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const name = form.name.trim();
    const value = form.value.trim();
    const button_label = form.button_label.trim() || `Abrir ${name}`;
    if (!name || !value) { setError("Completá el nombre y el dato (número, @ o link)."); return; }
    setSaving(true); setError("");
    const payload = { name, value, button_label, href: blankToNull(form.href), sort_order: Number(form.sort_order) || 0 };
    const supabase = createClient();
    const query = "id" in contact
      ? supabase.from("contact_channels").update(payload).eq("id", contact.id).select("id,name,value,button_label,href,sort_order").single()
      : supabase.from("contact_channels").insert(payload).select("id,name,value,button_label,href,sort_order").single();
    const { data, error: saveError } = await query;
    setSaving(false);
    if (saveError || !data) { setError(saveError?.message ?? "No se pudo guardar. Corré supabase/contacts.sql en el SQL Editor."); return; }
    onSaved(data as ContactChannel);
  }

  const preview = contactHref({ name: form.name, value: form.value, href: blankToNull(form.href) });

  return <div className="drawer-backdrop" onClick={onClose}><form className="product-editor" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
    <header><div><span>{"id" in contact ? "EDITAR" : "NUEVO"}</span><h2>Contacto</h2></div><button type="button" onClick={onClose}><X/></button></header>
    <div className="editor-grid">
      <label>Nombre<input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required placeholder="WhatsApp, Instagram, TikTok…"/></label>
      <label>Orden<input inputMode="numeric" value={form.sort_order} onChange={(event) => setForm((current) => ({ ...current, sort_order: Number(event.target.value) || 0 }))}/></label>
      <label className="wide">Número, usuario o link<input value={form.value} onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))} required placeholder="+54 9 … / @usuario / https://…"/></label>
      <label className="wide">Texto del botón<input value={form.button_label} onChange={(event) => setForm((current) => ({ ...current, button_label: event.target.value }))} placeholder="Abrir TikTok"/></label>
      <label className="wide">Link (opcional)<input value={form.href} onChange={(event) => setForm((current) => ({ ...current, href: event.target.value }))} placeholder="Si lo dejás vacío, se arma solo"/><small>Se va a abrir: {preview || "—"}</small></label>
    </div>
    {error && <div className="form-error" role="alert">{error}</div>}
    <button className="button gold full" disabled={saving}>{saving ? "Guardando…" : "Guardar contacto"}</button>
  </form></div>;
}
