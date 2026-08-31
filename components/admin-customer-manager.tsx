"use client";

import { MessageCircle, Pencil, Search, Trash2, UserPlus, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { blankToNull, type Customer, whatsappHref } from "@/lib/customer";
import { createClient } from "@/lib/supabase/client";

const emptyCustomer: Omit<Customer, "id"> = { name: "", phone: null, email: null, notes: null };

export function AdminCustomerManager({
  customers,
  onChange,
}: {
  customers: Customer[];
  onChange: (customers: Customer[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Customer | null>(null);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const filtered = useMemo(
    () => customers.filter((customer) => `${customer.name} ${customer.phone ?? ""} ${customer.email ?? ""}`.toLowerCase().includes(query.toLowerCase())),
    [customers, query],
  );

  async function remove(customer: Customer) {
    if (!window.confirm(`¿Eliminar a ${customer.name}?`)) return;
    const { error: deleteError } = await createClient().from("customers").delete().eq("id", customer.id);
    if (deleteError) { setError(deleteError.message); return; }
    onChange(customers.filter((item) => item.id !== customer.id));
    setError("");
    setMessage("Cliente eliminado.");
  }

  function saved(customer: Customer) {
    onChange(customers.some((item) => item.id === customer.id) ? customers.map((item) => item.id === customer.id ? customer : item) : [customer, ...customers]);
    setEditing(null);
    setCreating(false);
    setError("");
    setMessage("Cliente guardado.");
  }

  return <>
    <header><div><span>TIENDA</span><h1>Clientes</h1><p>Guardá nombre, WhatsApp y notas de quienes te consultan.</p></div><button className="button gold" onClick={() => { setCreating(true); setEditing(null); }}><UserPlus/> Nuevo cliente</button></header>
    {message && <div className="admin-message">{message}<button type="button" onClick={() => setMessage("")}><X/></button></div>}
    {error && <div className="form-error" role="alert">{error}</div>}
    <div className="admin-toolbar"><Search/><input aria-label="Buscar clientes" placeholder="Buscar por nombre, teléfono o mail" value={query} onChange={(event) => setQuery(event.target.value)}/><strong>{filtered.length} clientes</strong></div>
    <div className="admin-table-wrap"><table><thead><tr><th>Cliente</th><th>WhatsApp</th><th>Email</th><th>Notas</th><th/></tr></thead><tbody>
      {filtered.map((customer) => {
        const chat = customer.phone ? whatsappHref(customer.phone) : null;
        return <tr key={customer.id}><td><strong>{customer.name}</strong></td><td>{customer.phone ?? "—"}</td><td>{customer.email ?? "—"}</td><td>{customer.notes ?? "—"}</td><td><div className="row-actions">{chat ? <a className="whatsapp-icon" href={chat} target="_blank" rel="noreferrer" aria-label={`WhatsApp a ${customer.name}`}><MessageCircle/></a> : null}<button onClick={() => { setEditing(customer); setCreating(false); }} aria-label={`Editar ${customer.name}`}><Pencil/></button><button className="danger" onClick={() => remove(customer)} aria-label={`Eliminar ${customer.name}`}><Trash2/></button></div></td></tr>;
      })}
    </tbody></table>
    {!filtered.length && <div className="admin-empty"><Users/><p>{customers.length ? "No hay clientes para esa búsqueda." : "Todavía no hay clientes."}</p></div>}
    </div>
    {(editing || creating) && <CustomerEditor customer={editing ?? emptyCustomer} onClose={() => { setEditing(null); setCreating(false); }} onSaved={saved}/>}
  </>;
}

function CustomerEditor({ customer, onClose, onSaved }: { customer: Customer | Omit<Customer, "id">; onClose: () => void; onSaved: (customer: Customer) => void }) {
  const [form, setForm] = useState({
    name: customer.name,
    phone: customer.phone ?? "",
    email: customer.email ?? "",
    notes: customer.notes ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) { setError("Escribí el nombre."); return; }
    setSaving(true); setError("");
    const payload = { name, phone: blankToNull(form.phone), email: blankToNull(form.email), notes: blankToNull(form.notes) };
    const supabase = createClient();
    const query = "id" in customer
      ? supabase.from("customers").update(payload).eq("id", customer.id).select("id,name,phone,email,notes").single()
      : supabase.from("customers").insert(payload).select("id,name,phone,email,notes").single();
    const { data, error: saveError } = await query;
    setSaving(false);
    if (saveError || !data) { setError(saveError?.message ?? "No se pudo guardar el cliente."); return; }
    onSaved(data as Customer);
  }

  return <div className="drawer-backdrop" onClick={onClose}><form className="product-editor" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
    <header><div><span>{"id" in customer ? "EDITAR" : "NUEVO"}</span><h2>Cliente</h2></div><button type="button" onClick={onClose}><X/></button></header>
    <div className="editor-grid">
      <label className="wide">Nombre<input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required autoComplete="name"/></label>
      <label>WhatsApp<input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} inputMode="tel" autoComplete="tel" placeholder="5492954…"/></label>
      <label>Email<input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} autoComplete="email" placeholder="opcional"/></label>
      <label className="wide">Notas<textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Talle, pedidos, cómo llegó…"/></label>
    </div>
    {error && <div className="form-error" role="alert">{error}</div>}
    <button className="button gold full" disabled={saving}>{saving ? "Guardando…" : "Guardar cliente"}</button>
  </form></div>;
}
