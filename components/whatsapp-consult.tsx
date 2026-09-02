"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { consultLeadPayload, consultMessage, readStoredLead, STORE_WHATSAPP, storeWhatsAppHref, writeStoredLead } from "@/lib/customer";
import { createClient } from "@/lib/supabase/client";
import { supabasePublicEnv } from "@/lib/supabase/env";

async function saveLead(name: string, phone: string, notes: string) {
  if (!supabasePublicEnv()) return;
  const lead = consultLeadPayload(name, phone, notes);
  if (!lead) return;
  const supabase = createClient();
  await supabase.from("customers").insert({ name: lead.name, phone: lead.phone, email: null, notes: lead.notes || null });
}

function openChat(name: string, message: string, storePhone: string) {
  window.open(storeWhatsAppHref(consultMessage(name, message), storePhone), "_blank", "noopener,noreferrer");
}

export function WhatsAppConsult({
  message,
  storePhone,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  message: string;
  storePhone?: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const chatPhone = storePhone || STORE_WHATSAPP;

  function start() {
    const lead = readStoredLead();
    if (lead) {
      openChat(lead.name, message, chatPhone);
      void saveLead(lead.name, lead.phone, message);
      return;
    }
    setOpen(true);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const lead = consultLeadPayload(name, phone, message);
    if (!lead) { setError("Completá tu nombre y un WhatsApp válido."); return; }
    writeStoredLead(lead.name, lead.phone);
    openChat(lead.name, message, chatPhone);
    setOpen(false);
    void saveLead(lead.name, lead.phone, lead.notes);
  }

  return <>
    <button type="button" className={className} aria-label={ariaLabel} onClick={start}>{children}</button>
    {open && <div className="drawer-backdrop" onClick={() => setOpen(false)}>
      <form className="product-editor lead-editor" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
        <header><div><span>WHATSAPP</span><h2>Tu consulta</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar"><X/></button></header>
        <p>Dejá tu nombre y WhatsApp para que quedes como cliente. Después se abre el chat.</p>
        <div className="editor-grid">
          <label className="wide">Nombre<input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" placeholder="Tu nombre"/></label>
          <label className="wide">Tu WhatsApp<input value={phone} onChange={(event) => setPhone(event.target.value)} required inputMode="tel" autoComplete="tel" placeholder="299 123-4567"/></label>
        </div>
        {error && <div className="form-error" role="alert">{error}</div>}
        <button className="button gold full"><MessageCircle/> Continuar a WhatsApp</button>
      </form>
    </div>}
  </>;
}
