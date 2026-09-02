"use client";

import { ImagePlus, Megaphone, X } from "lucide-react";
import { useRef, useState } from "react";
import { AD_SLOTS, emptyAd, type Ad } from "@/lib/ads";
import { PRODUCT_IMAGE_TYPES, uploadProductImage, validateProductImage } from "@/lib/product-images";
import { createClient } from "@/lib/supabase/client";

const imageAccept = PRODUCT_IMAGE_TYPES.join(",");

export function AdminAdManager({ ads, onChange }: { ads: Ad[]; onChange: (ads: Ad[]) => void }) {
  const slots = AD_SLOTS.map((slot) => ads.find((ad) => ad.slot === slot.id) ?? emptyAd(slot.id));
  return <>
    <header><div><span>TIENDA</span><h1>Publicidad</h1><p>Dos avisos chicos: una foto, un título, un texto y un link. Si no está activo, no se muestra.</p></div></header>
    <div className="ad-admin-grid">{slots.map((ad) => <AdEditor key={ad.slot} ad={ad} onSaved={(saved) => onChange([...ads.filter((item) => item.slot !== saved.slot), saved])}/>)}</div>
  </>;
}

function AdEditor({ ad, onSaved }: { ad: Ad; onSaved: (ad: Ad) => void }) {
  const slot = AD_SLOTS.find((item) => item.id === ad.slot)!;
  const [form, setForm] = useState(ad);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  async function chooseImage(file: File | undefined) {
    if (!file) return;
    const invalid = validateProductImage(file);
    if (invalid) { setError(invalid); return; }
    setError("");
    const { url, error: uploadError } = await uploadProductImage(createClient(), file, `ads/${ad.slot}`);
    if (uploadError || !url) { setError(uploadError ?? "No se pudo subir la foto."); return; }
    setForm((current) => ({ ...current, image_url: url }));
    if (fileInput.current) fileInput.current.value = "";
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true); setError(""); setMessage("");
    const payload = {
      slot: ad.slot,
      title: form.title.trim(),
      description: form.description.trim(),
      href: form.href.trim(),
      image_url: form.image_url,
      active: form.active,
    };
    const { data, error: saveError } = await createClient().from("ads").upsert(payload, { onConflict: "slot" }).select("id,slot,title,description,href,image_url,active").single();
    setSaving(false);
    if (saveError || !data) { setError(saveError?.message ?? "No se pudo guardar. Corré supabase/ads.sql en el SQL Editor."); return; }
    onSaved(data as Ad);
    setMessage("Guardado.");
  }

  return <form className="ad-admin-card" onSubmit={submit}>
    <header><Megaphone/><div><span>{slot.label}</span><p>{slot.hint}</p></div></header>
    <div className="image-picker">
      {form.image_url ? <div className="ad-admin-preview"><img src={form.image_url} alt=""/><button type="button" aria-label="Quitar foto" onClick={() => setForm((current) => ({ ...current, image_url: null }))}><X/></button></div> : <div className="image-placeholder"><ImagePlus/><small>Una foto · JPG, PNG o WEBP</small></div>}
      <div className="image-actions">
        <input ref={fileInput} type="file" accept={imageAccept} aria-label="Foto del aviso" onChange={(event) => chooseImage(event.target.files?.[0])}/>
        <button type="button" className="button gold" onClick={() => fileInput.current?.click()}>Cargar foto</button>
      </div>
    </div>
    <label>Título<input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Opcional"/></label>
    <label>Descripción<textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Texto corto"/></label>
    <label>Link al hacer click<input value={form.href} onChange={(event) => setForm((current) => ({ ...current, href: event.target.value }))} placeholder="https://…"/></label>
    <label className="checkbox"><input type="checkbox" checked={form.active} onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))}/> Mostrar en la tienda</label>
    {message && <div className="admin-message">{message}</div>}
    {error && <div className="form-error" role="alert">{error}</div>}
    <button className="button gold" disabled={saving}>{saving ? "Guardando…" : "Guardar aviso"}</button>
  </form>;
}
